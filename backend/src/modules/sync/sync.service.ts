import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

@Injectable()
export class SyncService {
  private readonly AirtableTablesUrl = (baseId: string, tableId: string) =>
    `https://api.airtable.com/v0/${baseId}/${tableId}`;

  constructor(private prisma: PrismaService) {}

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
        return 'ERROR';
      }

      const {
        supabaseTable,
        airtableTable,
        supabaseConnections,
        airtableConnections,
      } = mapping;

      if (!supabaseConnections || !airtableConnections) {
        return 'ERROR';
      }

      const supabase = createClient(
        supabaseConnections.projectUrl,
        supabaseConnections.anonApiKey,
      );
      const { data: supabaseData, error: supabaseError } = await supabase
        .from(supabaseTable)
        .select('*');

      if (supabaseError) {
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

      const batchSize = 10;
      for (let i = 0; i < supabaseData.length; i += batchSize) {
        const batch = supabaseData.slice(i, i + batchSize);
        const records = batch.map((row) => ({ fields: row }));

        try {
          await axios.post(airtableUrl, { records }, { headers });
        } catch (error) {
          return 'ERROR';
        }
      }

      return 'SUCCESS';
    } catch (error) {
      return 'ERROR';
    }
  }
}
