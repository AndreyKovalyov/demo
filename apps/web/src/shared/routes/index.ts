export enum RoutePath {
  Home = '/',
  Login = '/login',
  Employees = '/employees',
  Employee = '/employees/:id',
  EmployeeEdit = '/employees/:id/edit',
  Departments = '/departments',
  Vacations = '/vacations',
  UiKit = '/ui-kit',
  Forbidden = '/forbidden',
  NotFound = '/not-found',
  Fallback = '/:pathMatch(.*)*'
}

export enum RouteName {
  Login = 'login',
  Employees = 'employees',
  Employee = 'employee',
  EmployeeEdit = 'employee-edit',
  Departments = 'departments',
  Vacations = 'vacations',
  UiKit = 'ui-kit',
  Forbidden = 'forbidden',
  NotFound = 'not-found'
}

export const employeePath = (id: string) =>
  RoutePath.Employee.replace(':id', encodeURIComponent(id))
export const employeeEditPath = (id: string) =>
  RoutePath.EmployeeEdit.replace(':id', encodeURIComponent(id))
