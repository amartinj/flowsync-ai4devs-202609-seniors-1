import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los dos scenarios sin test
 * del requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: el responsable identificable y la ausencia de
 * datos de cuenta, en la tarea suelta y en la lista.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function tareaDeAda(client: any) {
    const ada = await User.create({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secreto123',
    })
    const tarea = await Task.create({ title: 'Escribir el motor', assigneeId: ada.id })

    const login = await client
      .post('/api/v1/auth/login')
      .json({ email: 'ada@example.com', password: 'secreto123' })

    return { tarea, token: login.body().data.token as string }
  }

  test('el responsable de una tarea trae su nombre y sus iniciales', async ({ client, assert }) => {
    const { tarea, token } = await tareaDeAda(client)

    const response = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: '2026-10-04' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const { assignee } = response.body().data
    assert.equal(assignee.fullName, 'Ada Lovelace')
    assert.equal(assignee.initials, 'AL')
  })

  test('el responsable de una tarea no lleva el email ni otros datos de cuenta', async ({
    client,
    assert,
  }) => {
    const { tarea, token } = await tareaDeAda(client)

    const suelta = await client
      .get(`/api/v1/tasks/${tarea.id}`)
      .qs({ today: '2026-10-04' })
      .header('Authorization', `Bearer ${token}`)
    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    suelta.assertStatus(200)
    lista.assertStatus(200)

    const asignados = [suelta.body().data.assignee, lista.body().data[0].assignee]
    for (const assignee of asignados) {
      assert.notProperty(assignee, 'email')
      assert.notProperty(assignee, 'createdAt')
      assert.notProperty(assignee, 'updatedAt')
    }
  })
})
