export interface SelectOption<T extends string> {
  value: T
  label: string
  disabled?: boolean
}
