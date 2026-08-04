import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsFaqSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_faq_sections';
  info: {
    description: 'A section containing multiple FAQs';
    displayName: 'FAQ Section';
    icon: 'comments';
  };
  attributes: {
    description: Schema.Attribute.Text;
    faqs: Schema.Attribute.Component<'shared.faq-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Frequently Asked Questions'>;
  };
}

export interface SectionsFeaturesSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_features_sections';
  info: {
    displayName: 'Features Section';
    icon: 'star';
  };
  attributes: {
    features: Schema.Attribute.Component<'shared.content-block', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsLatestBlogs extends Struct.ComponentSchema {
  collectionName: 'components_sections_latest_blogs';
  info: {
    displayName: 'Latest Blogs';
    icon: 'layer-group';
  };
  attributes: {
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Informing you with industry focused updates'>;
    selected_blogs: Schema.Attribute.Relation<'oneToMany', 'api::page.page'>;
    tag: Schema.Attribute.String & Schema.Attribute.DefaultTo<'LATEST BLOGS'>;
  };
}

export interface SectionsOverviewSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_overview_sections';
  info: {
    displayName: 'Overview Section';
    icon: 'book';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    image: Schema.Attribute.Media<'images'>;
    sub_descriptions: Schema.Attribute.JSON;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedContentBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_content_blocks';
  info: {
    displayName: 'Content Block';
    icon: 'align-left';
  };
  attributes: {
    background_color: Schema.Attribute.Enumeration<['white', 'light', 'dark']> &
      Schema.Attribute.DefaultTo<'white'>;
    image: Schema.Attribute.Media<'images'>;
    paragraphs: Schema.Attribute.RichText;
    reverse_layout: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_items';
  info: {
    description: 'A single Question and Answer item';
    displayName: 'FAQ Item';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedHeroBanner extends Struct.ComponentSchema {
  collectionName: 'components_shared_hero_banners';
  info: {
    displayName: 'Hero Banner';
    icon: 'image';
  };
  attributes: {
    background_image: Schema.Attribute.Media<'images'>;
    breadcrumbs: Schema.Attribute.Component<'shared.link-item', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLinkItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_link_items';
  info: {
    displayName: 'Link Item';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    target: Schema.Attribute.Enumeration<['_self', '_blank']>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: 'A rich text editor block for long-form content like blogs.';
    displayName: 'Rich Text';
    icon: 'text-width';
  };
  attributes: {
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    canonical_url: Schema.Attribute.String;
    keywords: Schema.Attribute.String;
    meta_description: Schema.Attribute.Text & Schema.Attribute.Required;
    meta_title: Schema.Attribute.String & Schema.Attribute.Required;
    og_image: Schema.Attribute.Media<'images'>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'sections.faq-section': SectionsFaqSection;
      'sections.features-section': SectionsFeaturesSection;
      'sections.latest-blogs': SectionsLatestBlogs;
      'sections.overview-section': SectionsOverviewSection;
      'shared.content-block': SharedContentBlock;
      'shared.faq-item': SharedFaqItem;
      'shared.hero-banner': SharedHeroBanner;
      'shared.link-item': SharedLinkItem;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
    }
  }
}
