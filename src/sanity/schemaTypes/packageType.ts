import { DocumentTextIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const packageType = defineType({
  name: 'package',
  title: 'Package',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'traffic',
      type: 'string',
    }),
    defineField({
      name: 'timeTraffic',
      type: 'string',
    }),
    defineField({
      name: 'price',
      type: 'string',
    }),
    defineField({
      name: 'time',
      type: 'string',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
      ],
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
    }),
    defineField({
      name: 'sub_categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'sub_category' } })],
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
    }),
    defineField({
      name: 'globalField',
      type: 'reference',
      to: { type: 'global' }, 
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'string',
      hidden: true, // Ẩn trường này khỏi giao diện
      }),
  ],
  orderings: [
    { title: 'Order Rank', name: 'orderRankAsc', by: [{ field: 'orderRank', direction: 'asc' }] }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      globalTitle: 'globalField.title',
    },
    prepare(selection) {
      return { ...selection };
      
    },
  },
});
