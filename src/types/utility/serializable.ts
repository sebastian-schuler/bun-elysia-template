export type Serializable =
    | string
    | number
    | boolean
    | null
    | undefined
    | Date
    | Serializable[]
    | { [key: string]: Serializable };
