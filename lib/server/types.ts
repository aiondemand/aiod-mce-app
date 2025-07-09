import { z } from 'zod';

const AiodEntrySchema = z.object({
  editor: z.array(z.number().int()),
  status: z.string(),
});

const ContentSchema = z.object({
  plain: z.string().max(65535).optional(),
  html: z.string().max(65535).optional(),
});

const RequiredContentSchema = z.object({
  plain: z.string().min(1).max(65535),
});

const AddressSchema = z.object({
  region: z.string().max(256).optional().describe(
    "A subdivision of the country. Not necessary for most countries."
  ),
  locality: z.string().max(256).optional().describe(
    "A city, town or village."
  ),
  street: z.string().max(256).optional().describe(
    "The street address."
  ),
  postal_code: z.string().max(64).optional().describe(
    "The postal code."
  ),
  address: z.string().max(256).optional().describe(
    "Free text, in case the separate parts such as the street, postal code and country cannot be confidently separated."
  ),
  country: z.string().length(3).optional().describe(
    "The country as ISO 3166-1 alpha-3"
  ),
});

const GeoSchema = z.object({
  latitude: z.number().describe(
    "The latitude of a location in degrees (WGS84)"
  ),
  longitude: z.number().describe(
    "The longitude of a location in degrees (WGS84)"
  ),
  elevation_millimeters: z.number().int().optional().describe(
    "The elevation in millimeters with respect to the WGS84 ellipsoid"
  ),
});

const LocationSchema = z.object({
  address: AddressSchema.optional().describe(
    "A postal address"
  ),
  geo: GeoSchema.optional().describe(
    "The geographic coordinates of a physical location"
  ),
});

const MediaSchema = z.object({
  platform: z.string().max(64).optional().describe(
    "The external platform from which this resource originates. Leave empty if this item originates from AIoD. If platform is not None, the platform_resource_identifier should be set as well."
  ),
  platform_resource_identifier: z.string().max(256).optional().describe(
    "A unique identifier issued by the external platform that's specified in 'platform'. Leave empty if this item is not part of an external platform. For example, for HuggingFace, this should be the /, and for Openml, the OpenML identifier."
  ),
  checksum: z.string().max(1800).optional().describe(
    "The value of a checksum algorithm ran on this content."
  ),
  checksum_algorithm: z.string().max(64).optional().describe(
    "The checksum algorithm."
  ),
  copyright: z.string().max(256).optional().describe(
    "Copyright information for the media."
  ),
  content_url: z.string().max(1800).describe(
    "The URL of the media content."
  ),
  content_size_kb: z.number().int().optional().describe(
    "The size of the media content in kilobytes."
  ),
  date_published: z.string().datetime().optional().describe(
    "The datetime (utc) on which this Media was first published on an external platform."
  ),
  description: z.string().max(1800).optional().describe(
    "A description of the media."
  ),
  encoding_format: z.string().max(256).optional().describe(
    "The mimetype of this media file."
  ),
  name: z.string().max(256).optional().describe(
    "The name of the media."
  ),
  technology_readiness_level: z.number().int().min(1).max(9).optional().describe(
    "The technology readiness level (TRL) of the media. TRL 1 is the lowest and stands for 'Basic principles observed', TRL 9 is the highest and stands for 'actual system proven in operational environment'."
  ),
});

export type Media = z.infer<typeof MediaSchema>;
export { MediaSchema };

export type Address = z.infer<typeof AddressSchema>;
export type Geo = z.infer<typeof GeoSchema>;
export type Location = z.infer<typeof LocationSchema>;
export { AddressSchema, GeoSchema, LocationSchema };

const resourceBaseSchema = z.object({
  identifier: z.string().optional(),
  platform: z.string().optional(),
  platform_resource_identifier: z.string().optional(),
  name: z.string().min(2).max(256),
  date_published: z.string().datetime().optional(),
  date_deleted: z.string().datetime().optional(),
  same_as: z.string().max(256).optional(),
  aiod_entry: AiodEntrySchema.optional(),
  alternate_name: z.array(z.string()).optional(),
  application_area: z.array(z.string()).optional(),
  contact: z.array(z.number().int()).optional(),
  content: ContentSchema.optional(),
  creator: z.array(z.number().int()).optional(),
  description: ContentSchema.optional(),
  has_part: z.array(z.number().int()).optional(),
  industrial_sector: z.array(z.string()).optional(),
  is_part_of: z.array(z.number().int()).optional(),
  keyword: z.array(z.string()).optional(),
  location: z.array(LocationSchema).optional(),
  media: z.array(MediaSchema).optional(),
  note: z.array(z.string().max(8000)).optional(),
  relevant_link: z.array(z.string()).optional(),
  relevant_resource: z.array(z.number().int()).optional(),
  relevant_to: z.array(z.number().int()).optional(),
  research_area: z.array(z.string()).optional(),
  scientific_domain: z.array(z.string()).optional(),
});

export type ResourceBaseSchema = z.infer<typeof resourceBaseSchema>;

export const eventSchema = resourceBaseSchema.extend({
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  schedule: z.string().max(1800).optional(),
  registration_link: z.string().max(256).optional(),
  mode: z.string(),
  organiser: z.number().int().optional(),
  performer: z.array(z.number().int()).optional(),
  status: z.string().optional(),
});

export type Event = z.infer<typeof eventSchema>;

const DistributionSchema = z.object({
  platform: z.string().max(64).optional().describe(
    "The external platform from which this resource originates. Leave empty if this item originates from AIoD. If platform is not None, the platform_resource_identifier should be set as well."
  ),
  platform_resource_identifier: z.string().max(256).optional().describe(
    "A unique identifier issued by the external platform that's specified in 'platform'. Leave empty if this item is not part of an external platform. For example, for HuggingFace, this should be the /, and for Openml, the OpenML identifier."
  ),
  checksum: z.string().max(1800).optional().describe(
    "The value of a checksum algorithm ran on this content."
  ),
  checksum_algorithm: z.string().max(64).optional().describe(
    "The checksum algorithm."
  ),
  copyright: z.string().max(256).optional().describe(
    "Copyright information for the distribution."
  ),
  content_url: z.string().max(1800).describe(
    "The URL of the content."
  ),
  content_size_kb: z.number().int().optional().describe(
    "The size of the content in kilobytes."
  ),
  date_published: z.string().datetime().optional().describe(
    "The datetime (utc) on which this Distribution was first published on an external platform."
  ),
  description: z.string().max(1800).optional().describe(
    "A description of the distribution."
  ),
  encoding_format: z.string().max(256).optional().describe(
    "The mimetype of this file."
  ),
  name: z.string().max(256).optional().describe(
    "The name of the distribution."
  ),
  technology_readiness_level: z.number().int().min(1).max(9).optional().describe(
    "The technology readiness level (TRL) of the distribution. TRL 1 is the lowest and stands for 'Basic principles observed', TRL 9 is the highest and stands for 'actual system proven in operational environment'."
  ),
});

export const publicationSchema = resourceBaseSchema.extend({
  is_accessible_for_free: z.boolean().optional(),
  version: z.string().max(256).optional(),
  permanent_identifier: z.string().max(256).optional(),
  isbn: z.string().min(10).max(13).optional().or(z.literal('')),
  issn: z.string().min(8).max(8).optional().or(z.literal('')),
  distribution: z.array(DistributionSchema).optional(),
  documents: z.array(z.number().int()).optional(),
  license: z.string().optional(),
  type: z.string().optional(),
});

export type Publication = z.infer<typeof publicationSchema>;

export const educationalResourceSchema = resourceBaseSchema.extend({
  time_required: z.string().max(256).optional(),
  access_mode: z.array(z.string()).optional(),
  educational_level: z.array(z.string()).optional(),
  in_language: z.array(z.string()).optional(),
  pace: z.string().optional(),
  prerequisite: z.array(z.string()).optional(),
  target_audience: z.array(z.string()).optional(),
  type: z.string().optional(),
});

export type EducationalResource = z.infer<typeof educationalResourceSchema>;

export const newsSchema = resourceBaseSchema.extend({
  headline: z.string().min(1).max(256),
  content: RequiredContentSchema,
  category: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type News = z.infer<typeof newsSchema>;

export type Resource = Event | Publication | EducationalResource | News;
