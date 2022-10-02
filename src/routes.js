import views from 'pages'
//list your routes here
export const routes = [
  { path: '/', element: <views.Landing /> },
  { path: '/blocks', element: <views.Blocks /> },
  { path: '/blocks/:id', element: <views.BlockDetail /> },
  { path: '/transactions', element: <views.Transactions /> },
  { path: '/transactions/:id', element: <views.TransactionDetail /> },
  { path: '/address/:id', element: <views.Address /> },
  { path: '/domain/:id', element: <views.Domain /> },
  { path: '/contracts', element: <views.Contracts /> },
  { path: '*', element: <views.NotFound /> },
]
