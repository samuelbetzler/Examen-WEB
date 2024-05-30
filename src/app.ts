import server from 'express'
import{ auditoriaRouter, canchaRouter,deportistaRouter, separacioncancha} from './routes'

const app = server()

app.use(server.json())
app.use(server.urlencoded({extended: true}))

//http://localhost:3000/cancha
app.use('/cancha', canchaRouter)
app.use('/deportista', deportistaRouter)
app.use('/separacioncancha', separacioncancha)
app.use('/auditoria',auditoriaRouter)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});