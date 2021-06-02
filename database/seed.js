const User = require('../models/userModel')
const Task = require('../models/taskModel')
const Message = require('../models/messageModel')

const seed = async () => {
  await User.create({ name: 'Client1', password: 'Grillkorv', email: 'client1@yahoo.com' })
  await User.create({ name: 'Client2', password: 'Grillkorv', email: 'client2@yahoo.com' })
  await User.create({ name: 'Client3', password: 'Grillkorv', email: 'client3@yahoo.com' })
  await User.create({ name: 'Client4', password: 'Grillkorv', email: 'client4@yahoo.com' })
  await User.create({ name: 'Client5', password: 'Grillkorv', email: 'client5@yahoo.com' })
  await User.create({ name: 'Client6', password: 'Grillkorv', email: 'client6@yahoo.com' })

  await User.create({ name: 'Worker1', password: 'Grillkorv', email: 'worker1@yahoo.com', role: 'worker' })
  await User.create({ name: 'Worker2', password: 'Grillkorv', email: 'worker2@yahoo.com', role: 'worker' })
  await User.create({ name: 'Worker3', password: 'Grillkorv', email: 'worker3@yahoo.com', role: 'worker' })

  await User.create({ name: 'Pelle', password: 'Grillkorv', email: 'pelle@yahoo.com', role: 'admin' })
  await User.create({ name: 'Emma', password: 'Grillkorv', email: 'emma@yahoo.com', role: 'admin' })
  await User.create({ name: 'Renzo', password: 'Grillkorv', email: 'renzo@yahoo.com', role: 'admin' })

  await Task.create({ title: 'Köp tapeter', clientId: 1, workerId: 7 })
  await Task.create({ title: 'Sätt upp tapeter', clientId: 1, workerId: 7 })
  await Task.create({ title: 'Måla hallen', clientId: 1, workerId: 9 })
  await Task.create({ title: 'Riv innervägg', clientId: 1, workerId: 8, done: true })
  await Task.create({ title: 'Byt kylskåp', clientId: 1, workerId: 7, done: true })
  await Task.create({ title: 'Lägg klinker i hallen', clientId: 2, workerId: 7 })
  await Task.create({ title: 'Fixa fuktskada', clientId: 2, workerId: 8 })
  await Task.create({ title: 'Lägg om taket', clientId: 2, workerId: 8 })
  await Task.create({ title: 'Bygg pool', clientId: 2, workerId: 9 })
  await Task.create({ title: 'Putsa fönstren', clientId: 3, workerId: 7 })
  await Task.create({ title: 'Spränk bort sten', clientId: 4, workerId: 8 })
  await Task.create({ title: 'Slipa golven', clientId: 5, workerId: 8 })
  await Task.create({ title: 'Bygg öppen spis', clientId: 6, workerId: 7 })
  await Task.create({ title: 'Renovera badrum', clientId: 2, workerId: 9 })

  await Message.create({ content: 'Vilket badkar ville du ha?', UserId: 7, TaskId: 1 })
  await Message.create({ content: 'Vilken badrumskran ska vi ta?', UserId: 9, TaskId: 3 })
  await Message.create({ content: 'Ska hela väggen rivas?', UserId: 8, TaskId: 4 })
  await Message.create({ content: 'Kommer 10:30?', UserId: 7, TaskId: 5 })
  await Message.create({ content: 'Vilket tak vill du ha?', UserId: 7, TaskId: 6 })
  await Message.create({ content: 'Vilken färg ska kaklet ha?', UserId: 8, TaskId: 7 })
}

seed()


