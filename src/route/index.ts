import * as book from '@route/book'
import * as content from '@route/content'
import * as mcqs from '@route/mcqs'
import * as user from '@route/user'
import * as workspace from '@route/workspace'
import { ServerRoute } from 'hapi'

export const routes: ServerRoute[] = [
    // user routes
    user.create,
    user.login,
    user.info,
    user.logout,
    user.logoutall,
    // workspace routes
    workspace.create,
    workspace.list,
    workspace.deleteWokspace,
    workspace.updateWokspace,
    workspace.getWokspace,
    // content routes
    content.create,
    content.deleteContent,
    content.list,
    content.updateContent,
    content.getContent,
    // books routes
    book.list,
    book.create,
    book.deleteBook,
    book.updateBook,
    book.getBook,
    book.deleteBookMcq,
    // mcqs
    mcqs.create,
    mcqs.list,
    mcqs.deleteMcq,
    mcqs.getMcq
]
