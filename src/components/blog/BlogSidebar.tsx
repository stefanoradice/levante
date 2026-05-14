import Link from 'next/link'
import type { Category, Tag } from '@/types'
import { Badge } from '@/components/ui/Badge'

interface BlogSidebarProps {
  categories: Category[]
  tags: Tag[]
  activeCategorySlug?: string
  activeTagSlug?: string
}

export function BlogSidebar({
  categories,
  tags,
  activeCategorySlug,
  activeTagSlug,
}: BlogSidebarProps) {
  return (
    <aside className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-display font-semibold text-sm uppercase tracking-wider
          text-foreground-muted mb-4">
          Categorie
        </h3>
        <ul className="space-y-1">
          <li>
            <Link
              href="/blog"
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm
                transition-colors duration-150
                ${!activeCategorySlug && !activeTagSlug
                  ? 'bg-accent-subtle text-accent font-medium'
                  : 'text-foreground-muted hover:text-foreground hover:bg-background-secondary'
                }`}
            >
              <span>Tutti gli articoli</span>
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/blog?categoria=${cat.slug}`}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm
                  transition-colors duration-150
                  ${activeCategorySlug === cat.slug
                    ? 'bg-accent-subtle text-accent font-medium'
                    : 'text-foreground-muted hover:text-foreground hover:bg-background-secondary'
                  }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs opacity-60">{cat.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-sm uppercase tracking-wider
            text-foreground-muted mb-4">
            Tag
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                <Badge
                  variant={activeTagSlug === tag.slug ? 'accent' : 'default'}
                  className="cursor-pointer hover:bg-accent-subtle hover:text-accent
                    transition-colors duration-150"
                >
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
