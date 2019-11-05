export interface IQuestion {
    text: string
    user_Id: any
    workspace_Id: any
    is_active: boolean
}
export interface IAnswer {
    question_Id: any
    text: string
    is_correct: boolean
}

export interface IBookMcqs {
    book_Id: any
    question_Id: any
    order: number
}

export interface IMCQ extends IQuestion {
    text: string
    user_Id: any
    workspace_Id: any
    book_Id: any
    order: number
    is_active: boolean
    answers: IAnswer[]
}
