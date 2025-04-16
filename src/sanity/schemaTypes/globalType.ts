import { defineField, defineType } from 'sanity';

export const globalType = defineType({
  name: 'global',
  title: 'Global Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'globalField',
      title: 'Global Field',
      type: 'string',
      description: 'This field will be shared across all posts',
    }),
  ],
});
