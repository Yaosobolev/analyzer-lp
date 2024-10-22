export interface Value {
  id: number;
  value: string;
}

export interface ResultValue extends Value {
  idTable: number;
  idToTable: number;
}
export interface ConstantValue extends Value {
  idToTable: number;
}
