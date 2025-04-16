import type {StructureResolver} from 'sanity/structure'
import { MdArticle } from 'react-icons/md'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Blog')
    .items([
      orderableDocumentListDeskItem({
        S, // Cần truyền `S`
        context, // Cần truyền `context`
        type: 'package', // Kiểu dữ liệu muốn sắp xếp                                                    
        title: 'Packages',
        icon: MdArticle,
      }),
      S.documentTypeListItem('post').title('Posts'),
      // S.documentTypeListItem('package').title('Package'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('sub_category').title('Sub Categories'),
      S.documentTypeListItem('author').title('Authors'),
      S.documentTypeListItem('global').title('Global'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['post','package', 'category', 'sub_category' ,'author', 'global'].includes(item.getId()!),
      ),
    ])

