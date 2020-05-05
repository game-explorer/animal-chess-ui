import VueRouter from 'vue-router'

const Room = () => import('../components/Room');
const Chess = () => import('../components/Chess');

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Room,
        },
        {
            path: '/room',
            component: Room,
            name: 'room'
        },
        {
            path: "/game",
            component: Chess,
            name: 'game'
        }
    ]
});

export default router;