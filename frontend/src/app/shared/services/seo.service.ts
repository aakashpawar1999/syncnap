import { Inject, Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  setMetaTags(metaTags: { name: string; content: string }[]) {
    metaTags.forEach((tag: { name: string; content: string }) => {
      this.metaService.updateTag({ name: tag.name, content: tag.content });
    });
  }

  setMetaPropertyTags(metaTags: { property: string; content: string }[]) {
    metaTags.forEach((tag: { property: string; content: string }) => {
      this.metaService.updateTag({
        property: tag.property,
        content: tag.content,
      });
    });
  }

  setTitle(title: string) {
    this.titleService.setTitle(title);
  }

  setDescription(description: string) {
    this.metaService.updateTag({ name: 'description', content: description });
  }

  setCanonicalURL(url?: string) {
    const canonicalLink = this.document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', url ? url : this.document.URL);
    this.removeExistingCanonicalLink();
    this.document.head.appendChild(canonicalLink);
  }

  private removeExistingCanonicalLink() {
    const canonicalLinkElement = this.document.head.querySelector(
      'link[rel="canonical"]',
    );
    if (canonicalLinkElement) {
      this.document.head.removeChild(canonicalLinkElement);
    }
  }
}
