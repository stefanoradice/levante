import type {
  IPostRepository,
  IAuthorRepository,
  ICategoryRepository,
  ITagRepository,
  ICommentRepository,
  IPageRepository,
  IMenuRepository,
  IUserDataRepository,
} from './interfaces'
import { WordPressPostRepository } from './wordpress/PostRepository'
import { WordPressAuthorRepository } from './wordpress/AuthorRepository'
import {
  WordPressCategoryRepository,
  WordPressTagRepository,
} from './wordpress/CategoryTagRepository'
import { WordPressCommentRepository } from './wordpress/CommentRepository'
import { WordPressPageRepository } from './wordpress/PageRepository'
import { WordPressMenuRepository } from './wordpress/MenuRepository'
import { WordPressUserDataRepository } from './wordpress/UserDataRepository'

// To switch to Supabase: replace these with Supabase implementations
export function getPostRepository(): IPostRepository {
  return new WordPressPostRepository()
}

export function getAuthorRepository(): IAuthorRepository {
  return new WordPressAuthorRepository()
}

export function getCategoryRepository(): ICategoryRepository {
  return new WordPressCategoryRepository()
}

export function getTagRepository(): ITagRepository {
  return new WordPressTagRepository()
}

export function getCommentRepository(): ICommentRepository {
  return new WordPressCommentRepository()
}

export function getPageRepository(): IPageRepository {
  return new WordPressPageRepository()
}

export function getMenuRepository(): IMenuRepository {
  return new WordPressMenuRepository()
}

export function getUserDataRepository(): IUserDataRepository {
  return new WordPressUserDataRepository()
}
