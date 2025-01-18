import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SyncLogService } from '../sync-log/sync-log.service';
import { createClient } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';
import { SyncStatus } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class SyncService {
  private readonly AirtableTablesUrl = (baseId: string, tableId: string) =>
    `https://api.airtable.com/v0/${baseId}/${tableId}`;
  private readonly AirtableFieldsUrl = (baseId: string, tableId: string) =>
    `https://api.airtable.com/v0/meta/bases/${baseId}/tables/${tableId}/fields`;
  private readonly AirtableDeleteFieldUrl = (baseId: string, tableId: string) =>
    `https://api.airtable.com/v0/meta/bases/${baseId}/tables/${tableId}/fields/{fieldId}`;

  constructor(
    private prisma: PrismaService,
    private syncLogService: SyncLogService,
  ) {}

  inferDataType(value: any): string {
    if (typeof value === 'number') {
      // Distinguish between integers and floating-point numbers
      return Number.isInteger(value) ? 'integer' : 'numeric';
    }

    if (typeof value === 'string') {
      // Check for specific string formats
      if (!isNaN(Date.parse(value))) {
        return 'text';
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return 'date'; // Matches YYYY-MM-DD
      }
      if (/^\d+$/.test(value)) {
        return 'integer'; // Strings containing only digits
      }
      return 'text';
    }

    if (typeof value === 'boolean') {
      return 'text';
    }

    if (value instanceof Date) {
      return 'text';
    }

    if (Array.isArray(value)) {
      return 'array'; // Supabase supports arrays
    }

    if (typeof value === 'object' && value !== null) {
      return 'json'; // Match for JSON or object values
    }

    return 'text'; // Default to text for unmapped types
  }

  mapDataTypeToAirtable(dataType: string): string {
    switch (dataType.toLowerCase()) {
      case 'integer':
      case 'bigint':
      case 'smallint':
      case 'serial':
        return 'number';
      case 'numeric':
      case 'decimal':
      case 'real':
      case 'double precision':
        return 'number';
      case 'text':
      case 'character varying':
      case 'varchar':
      case 'char':
        return 'singleLineText';
      case 'boolean':
        return 'singleLineText';
      case 'date':
        return 'date';
      case 'timestamp':
      case 'timestamp without time zone':
      case 'timestamp with time zone':
        return 'singleLineText';
      case 'json':
      case 'jsonb':
        return 'multilineText';
      default:
        return 'singleLineText'; // Default to text for unmapped types
    }
  }

  async getSupabaseSchema(supabase: SupabaseClient, tableName: string) {
    try {
      const { data: supabaseData, error: supabaseError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      console.log(supabaseData, 'supabaseData');

      if (supabaseError) {
        console.error(
          'Error fetching data from Supabase:',
          supabaseError.message,
        );
        throw new Error('Failed to fetch table data.');
      }

      if (!supabaseData || supabaseData.length === 0) {
        console.warn(`Table "${tableName}" is empty. Using an empty schema.`);
        return [];
      }

      // Extract column names and infer data types from the first record
      const firstRecord = supabaseData[0];
      console.log(firstRecord, 'firstRecord');
      const schema = Object.keys(firstRecord).map((key) => ({
        column_name: key,
        data_type: this.inferDataType(firstRecord[key]),
      }));

      console.log(`Fetched schema for table "${tableName}":`, schema);
      return schema;
    } catch (error) {
      console.error('Error fetching Supabase schema:', error.message);
      throw new Error('Failed to fetch Supabase schema.');
    }
  }

  async getAirtableSchema(
    airtableBaseId: string,
    airtableTableId: string,
    airtableAccessToken: string,
  ) {
    const url = this.AirtableTablesUrl(airtableBaseId, airtableTableId);
    const headers = { Authorization: `Bearer ${airtableAccessToken}` };

    try {
      const response = await axios.get(url, { headers });
      const records = response.data.records;

      if (!records || records.length === 0) {
        return [];
      }

      // Extract fields from the first record
      return Object.keys(records[0].fields);
    } catch (error) {
      console.error('Error fetching Airtable schema:', error.message);
      throw new Error('Failed to fetch Airtable schema.');
    }
  }

  async updateAirtableSchema(
    airtableBaseId: string,
    airtableTableId: string,
    airtableAccessToken: string,
    supabaseSchema: any[],
    airtableSchema: any[],
  ) {
    const addFieldUrl = this.AirtableFieldsUrl(airtableBaseId, airtableTableId);
    const deleteFieldUrl = this.AirtableDeleteFieldUrl(
      airtableBaseId,
      airtableTableId,
    );
    const headers = {
      Authorization: `Bearer ${airtableAccessToken}`,
      'Content-Type': 'application/json',
    };

    // Map Supabase schema to a set of field names
    const supabaseFieldNames = new Set(
      supabaseSchema.map((col) => col.column_name),
    );

    // Remove unused fields in Airtable
    for (const airtableField of airtableSchema) {
      if (!supabaseFieldNames.has(airtableField.name)) {
        try {
          await axios.delete(
            deleteFieldUrl.replace('{fieldId}', airtableField.id),
            { headers },
          );
          console.log(
            `Removed unused field "${airtableField.name}" from Airtable.`,
          );
        } catch (error) {
          console.error(
            `Error removing field "${airtableField.name}" from Airtable:`,
            error.message,
          );
        }
      }
    }

    // Add missing fields to Airtable
    for (const column of supabaseSchema) {
      const { column_name, data_type } = column;

      // Skip if the column already exists in Airtable
      if (airtableSchema.some((field) => field.name === column_name)) {
        continue;
      }

      // Map Supabase data types to Airtable field types
      const airtableFieldType = this.mapDataTypeToAirtable(data_type);

      try {
        await axios.post(
          addFieldUrl,
          {
            name: column_name,
            type: airtableFieldType,
          },
          { headers },
        );
        console.log(`Added field "${column_name}" to Airtable.`);
      } catch (error) {
        console.error(
          `Error adding field "${column_name}" to Airtable:`,
          error.message,
        );
      }
    }
  }

  async getAirtableSchemaWithIds(
    airtableBaseId: string,
    airtableTableId: string,
    airtableAccessToken: string,
  ) {
    const url = this.AirtableTablesUrl(airtableBaseId, airtableTableId);
    const headers = { Authorization: `Bearer ${airtableAccessToken}` };

    try {
      const response = await axios.get(url, { headers });
      const fields = response.data.fields || [];

      // Return fields with names and IDs
      return fields.map((field: any) => ({
        id: field.id,
        name: field.name,
      }));
    } catch (error) {
      console.error('Error fetching Airtable schema:', error.message);
      throw new Error('Failed to fetch Airtable schema.');
    }
  }

  convertDataForAirtable(
    supabaseData: any[],
    supabaseSchema: { column_name: string; data_type: string }[],
  ): any[] {
    return supabaseData.map((row) => {
      const convertedRow: any = {};

      supabaseSchema.forEach((column) => {
        const { column_name, data_type } = column;
        const value = row[column_name];

        if (value === null || value === undefined) {
          convertedRow[column_name] = null; // Handle null/undefined values explicitly
          return;
        }

        // Convert data based on type
        switch (data_type) {
          case 'integer':
          case 'numeric':
            convertedRow[column_name] = Number(value);
            break;
          case 'text':
          case 'character varying':
          case 'varchar':
          case 'char':
            convertedRow[column_name] = String(value);
            break;
          case 'boolean':
            convertedRow[column_name] = !!value; // Convert to boolean
            break;
          case 'date':
          case 'timestamp':
          case 'timestamp without time zone':
          case 'timestamp with time zone':
            convertedRow[column_name] = new Date(value).toISOString(); // ISO 8601 format
            break;
          case 'json':
          case 'jsonb':
            convertedRow[column_name] =
              typeof value === 'string' ? value : JSON.stringify(value); // Ensure JSON format
            break;
          case 'array':
            convertedRow[column_name] = Array.isArray(value) ? value : [value]; // Ensure array format
            break;
          default:
            convertedRow[column_name] = value; // Default case
            break;
        }
      });

      return convertedRow;
    });
  }

  async syncTable(mappingId: string) {
    try {
      const mapping = await this.prisma.syncMapping.findUnique({
        where: { id: mappingId },
        include: {
          supabaseConnections: true,
          airtableConnections: true,
        },
      });

      if (!mapping) {
        await this.syncLogService.createLog(
          mappingId,
          SyncStatus.FAILURE,
          `Error fetching mapping.`,
        );
        return 'ERROR';
      }

      const {
        supabaseTable,
        airtableTable,
        supabaseConnections,
        airtableConnections,
      } = mapping;

      if (!supabaseConnections || !airtableConnections) {
        await this.syncLogService.createLog(
          mappingId,
          SyncStatus.FAILURE,
          `Error fetching Supabase or Airtable connections.`,
        );
        return 'ERROR';
      }

      const supabase = createClient(
        supabaseConnections.projectUrl,
        supabaseConnections.anonApiKey,
      );
      const supabaseSchema = await this.getSupabaseSchema(
        supabase,
        supabaseTable,
      );
      const airtableSchema = await this.getAirtableSchemaWithIds(
        airtableConnections.baseId,
        airtableTable,
        airtableConnections.accessToken,
      );

      await this.updateAirtableSchema(
        airtableConnections.baseId,
        airtableTable,
        airtableConnections.accessToken,
        supabaseSchema,
        airtableSchema,
      );

      const { data: supabaseData, error: supabaseError } = await supabase
        .from(supabaseTable)
        .select('*');

      if (supabaseError) {
        console.log(supabaseError, 'supabaseError');
        await this.syncLogService.createLog(
          mappingId,
          SyncStatus.FAILURE,
          `Error fetching data from Supabase.`,
        );
        return 'ERROR';
      }

      const airtableUrl = this.AirtableTablesUrl(
        airtableConnections.baseId,
        airtableTable,
      );
      const headers = {
        Authorization: `Bearer ${airtableConnections.accessToken}`,
        'Content-Type': 'application/json',
      };

      // Fetch existing Airtable records
      const existingRecords: any[] = [];
      let offset: string | undefined;
      // Dynamically determine the unique field (first field of the first record)
      const uniqueField = Object.keys(supabaseData[0])[0];

      try {
        do {
          const response = await axios.get(airtableUrl, {
            headers,
            params: offset ? { offset } : undefined,
          });

          const { records, offset: nextOffset } = response.data;
          existingRecords.push(...records);
          offset = nextOffset;
        } while (offset);
      } catch (error) {
        console.error('Error fetching existing Airtable records:', error);
        await this.syncLogService.createLog(
          mappingId,
          SyncStatus.FAILURE,
          `Error fetching existing Airtable records.`,
        );
        throw new Error('Failed to fetch Airtable records.');
      }

      // Extract unique field values from Airtable records
      const existingFieldValues = existingRecords.map(
        (record) => record.fields[uniqueField],
      );

      // Filter out records already in Airtable
      const newRecords = supabaseData.filter(
        (row) => !existingFieldValues.includes(row[uniqueField]),
      );
      console.log(newRecords, 'newRecords');

      const airtableData = this.convertDataForAirtable(
        newRecords,
        supabaseSchema,
      );

      const batchSize = 10;
      const batches = [];
      while (airtableData.length) {
        batches.push(airtableData.splice(0, batchSize));
      }

      for (const batch of batches) {
        const records = batch.map((row: any) => ({ fields: row }));

        try {
          await axios.post(airtableUrl, { records }, { headers });
        } catch (error) {
          await this.syncLogService.createLog(
            mappingId,
            SyncStatus.FAILURE,
            `Error syncing table "${supabaseTable}" to Airtable.`,
          );
          return 'ERROR';
        }
      }

      await this.syncLogService.createLog(
        mappingId,
        SyncStatus.SUCCESS,
        `The total of ${newRecords.length} records were added to Airtable.`,
      );
      return 'SUCCESS';
    } catch (error) {
      return 'ERROR';
    }
  }
}
