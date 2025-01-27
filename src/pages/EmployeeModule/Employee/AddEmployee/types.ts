export type Permissions = {
  label: string;
  name: string;
  checked: boolean;
  key: string;
};
export type CreateEmployeeProps = {
  name: string;
  phone: string;
  email: string;
  password: string;
  joining_date: string;
  employee_id: string;
  marital_status: string | null;
  bod: string;
  salary: number;
  department: string;
  designation: string;
  shift_and_schedule: string;
  supervisor: boolean;
  executives: string[];
  permissions?: Permissions[];
};

export type EmployeeFormProps = {
  tab: string;
  handleTab: (operation: string) => void;
  type: string;
  initialPermissionValues?: Permissions[];
};
