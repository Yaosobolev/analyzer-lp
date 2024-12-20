export interface Value {
  id: number;
  value: string;
  type?: string;
  variableValue?: string;
  declared?: boolean;
}

export interface ValueMapping {
  idTable: number;
  idToTable: number;
}

export interface ResultValue extends Value {
  idTable: number;
  idToTable: number;
}
export interface ConstantValue extends Value {
  idToTable: number;
}
