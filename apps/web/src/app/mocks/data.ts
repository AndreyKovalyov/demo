import { Role, unixMs } from '@sigma/domain'
import type { Actor, Department, Employee, VacationRequest } from '@sigma/domain'
import dayjs from '@/shared/lib/dayjs'
import { DEPARTMENT_IDS, EMPLOYEE_IDS, VACATION_IDS } from './ids'

export function createData() {
  const departments: Department[] = [
    {
      id: DEPARTMENT_IDS.product,
      name: 'Продукт',
      description: 'Дизайн, аналитика и развитие продукта',
      managerId: EMPLOYEE_IDS.smirnova,
      memberCount: 0
    },
    {
      id: DEPARTMENT_IDS.engineering,
      name: 'Разработка',
      description: 'Frontend, backend и инфраструктура',
      managerId: EMPLOYEE_IDS.orlov,
      memberCount: 0
    },
    {
      id: DEPARTMENT_IDS.support,
      name: 'Поддержка',
      description: 'Помощь пользователям и работа с обратной связью',
      managerId: EMPLOYEE_IDS.volkova,
      memberCount: 0
    }
  ]
  const employeeSeeds = [
    [EMPLOYEE_IDS.smirnova, 'Анна Смирнова', 'Product lead'],
    [EMPLOYEE_IDS.orlov, 'Михаил Орлов', 'Engineering lead'],
    [EMPLOYEE_IDS.volkova, 'Елена Волкова', 'Support lead'],
    [EMPLOYEE_IDS.petrov, 'Алексей Петров', 'Frontend developer'],
    [EMPLOYEE_IDS.kuznetsova, 'Мария Кузнецова', 'Product designer'],
    [EMPLOYEE_IDS.sokolov, 'Дмитрий Соколов', 'Backend developer'],
    [EMPLOYEE_IDS.morozova, 'Софья Морозова', 'Support specialist'],
    [EMPLOYEE_IDS.kozlov, 'Илья Козлов', 'QA engineer'],
    [EMPLOYEE_IDS.novikova, 'Полина Новикова', 'Product analyst'],
    [EMPLOYEE_IDS.lebedev, 'Артём Лебедев', 'DevOps engineer'],
    [EMPLOYEE_IDS.pavlova, 'Дарья Павлова', 'Support specialist'],
    [EMPLOYEE_IDS.egorov, 'Никита Егоров', 'Frontend developer'],
    [EMPLOYEE_IDS.popova, 'Ксения Попова', 'UX researcher'],
    [EMPLOYEE_IDS.fedorov, 'Максим Фёдоров', 'Backend developer'],
    [EMPLOYEE_IDS.andreeva, 'Ольга Андреева', 'Customer success manager'],
    [EMPLOYEE_IDS.vasilyev, 'Владислав Васильев', 'QA engineer'],
    [EMPLOYEE_IDS.zaytseva, 'Вероника Зайцева', 'Product designer'],
    [EMPLOYEE_IDS.nikolaev, 'Роман Николаев', 'Frontend developer'],
    [EMPLOYEE_IDS.makarova, 'Алина Макарова', 'Support specialist'],
    [EMPLOYEE_IDS.zakharov, 'Денис Захаров', 'Backend developer'],
    [EMPLOYEE_IDS.belova, 'Юлия Белова', 'Product analyst'],
    [EMPLOYEE_IDS.abramov, 'Андрей Абрамов', 'Frontend developer'],
    [EMPLOYEE_IDS.antonov, 'Павел Антонов', 'Backend developer'],
    [EMPLOYEE_IDS.grigorieva, 'Виктория Григорьева', 'Support specialist'],
    [EMPLOYEE_IDS.romanova, 'Екатерина Романова', 'Product designer'],
    [EMPLOYEE_IDS.savin, 'Сергей Савин', 'QA engineer'],
    [EMPLOYEE_IDS.belyaeva, 'Татьяна Беляева', 'Product analyst'],
    [EMPLOYEE_IDS.stepanov, 'Игорь Степанов', 'DevOps engineer'],
    [EMPLOYEE_IDS.titov, 'Константин Титов', 'Frontend developer'],
    [EMPLOYEE_IDS.guseva, 'Анастасия Гусева', 'Support specialist'],
    [EMPLOYEE_IDS.vinogradov, 'Вадим Виноградов', 'Backend developer'],
    [EMPLOYEE_IDS.tarasova, 'Наталья Тарасова', 'UX researcher'],
    [EMPLOYEE_IDS.komarov, 'Евгений Комаров', 'QA engineer'],
    [EMPLOYEE_IDS.kiseleva, 'Валерия Киселёва', 'Support specialist'],
    [EMPLOYEE_IDS.mikhailov, 'Анатолий Михайлов', 'Frontend developer'],
    [EMPLOYEE_IDS.rybakov, 'Глеб Рыбаков', 'Backend developer'],
    [EMPLOYEE_IDS.nikitina, 'Людмила Никитина', 'Product analyst'],
    [EMPLOYEE_IDS.pankratov, 'Степан Панкратов', 'Backend developer'],
    [EMPLOYEE_IDS.vlasova, 'Олеся Власова', 'Product designer'],
    [EMPLOYEE_IDS.filippov, 'Виктор Филиппов', 'QA engineer']
  ] as const

  const employeesById: Record<string, Employee> = {}
  employeeSeeds.forEach(([id, name, position], index) => {
    const team =
      position.includes('developer') || position.includes('engineer')
        ? 1
        : /Support|Customer/.test(position)
          ? 2
          : 0
    const department = departments[index < 3 ? index : team]!
    const base = {
      id,
      name,
      position,
      email:
        index === 1
          ? 'manager@demo.ru'
          : index === 3
            ? 'employee@demo.ru'
            : `person${index + 1}@demo.ru`,
      departmentId: department.id,
      managerId: index < 3 ? null : department.managerId,
      status: index === 7 || index === 12 ? ('on-vacation' as const) : ('active' as const),
      salary: 100000 + (index % 6) * 25000,
      joinedAt: unixMs(
        dayjs
          .utc('2023-01-01')
          .add(index % 3, 'year')
          .add(index % 12, 'month')
          .add(index, 'day')
          .valueOf()
      )
    }
    employeesById[base.id] =
      index < 3
        ? {
            ...base,
            kind: 'manager',
            deputyId:
              index === 1
                ? EMPLOYEE_IDS.petrov
                : index === 0
                  ? EMPLOYEE_IDS.kuznetsova
                  : EMPLOYEE_IDS.morozova
          }
        : { ...base, kind: 'employee' }
    department.memberCount++
  })

  const vacations = new Map<string, VacationRequest>()
  const vacationEmployees = [
    EMPLOYEE_IDS.petrov,
    EMPLOYEE_IDS.kuznetsova,
    EMPLOYEE_IDS.sokolov,
    EMPLOYEE_IDS.kozlov,
    EMPLOYEE_IDS.lebedev,
    EMPLOYEE_IDS.egorov,
    EMPLOYEE_IDS.morozova,
    EMPLOYEE_IDS.orlov,
    EMPLOYEE_IDS.popova
  ]

  vacationEmployees.forEach((employeeId, order) => {
    const employee = employeesById[employeeId]!
    const id = VACATION_IDS[order]!
    vacations.set(id, {
      id,
      employeeId: employee.id,
      employeeName: employee.name,
      departmentId: employee.departmentId,
      startDate: unixMs(dayjs.utc('2026-11-02').add(order, 'day').valueOf()),
      endDate: unixMs(dayjs.utc('2026-11-08').add(order, 'day').valueOf()),
      reason: ['Семейная поездка', 'Плановый отпуск', 'Нужен небольшой перерыв'][order % 3]!,
      status: order < 6 ? 'pending' : order === 6 ? 'rejected' : 'approved',
      createdAt: unixMs(dayjs.utc('2026-09-20T10:30:00').add(order, 'day').valueOf()),
      reviewedBy: order < 6 ? null : (employee.managerId ?? EMPLOYEE_IDS.smirnova)
    })
  })

  const accountsByEmail: Record<string, { email: string; password: string; actor: Actor }> = {
    'manager@demo.ru': {
      email: 'manager@demo.ru',
      password: 'demo1234',
      actor: {
        employeeId: EMPLOYEE_IDS.orlov,
        departmentId: DEPARTMENT_IDS.engineering,
        name: 'Михаил Орлов',
        roles: [Role.Manager]
      }
    },
    'employee@demo.ru': {
      email: 'employee@demo.ru',
      password: 'demo1234',
      actor: {
        employeeId: EMPLOYEE_IDS.petrov,
        departmentId: DEPARTMENT_IDS.engineering,
        name: 'Алексей Петров',
        roles: [Role.Employee]
      }
    }
  }

  return { employeesById, departments, vacations, accountsByEmail }
}
