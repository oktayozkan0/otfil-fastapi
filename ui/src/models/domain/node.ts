export interface Node {
    id: string
    sourcePosition: string
    type: string
    data: { label: any }
    targetPosition: string
    style: any
    position?: { x: number, y: number }
}
