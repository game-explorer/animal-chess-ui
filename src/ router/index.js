import VueRouter from 'vue-router'

const Chess = () => import('../components/Chess');

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Chess,
        }
    ]
});

export default router;