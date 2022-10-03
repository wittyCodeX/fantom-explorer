import views from 'pages'
//list your routes here
export const routes = [
  { path: '/', element: <views.Landing /> },
  { path: '/blocks', element: <views.Blocks /> },
  { path: '/staking', element: <views.Staking /> },
  { path: '/assets', element: <views.Assets /> },
  { path: '/epochs', element: <views.Epochs /> },
  { path: '/epochs/:id', element: <views.EpochDetail /> },
  { path: '/blocks/:id', element: <views.BlockDetail /> },
  { path: '/assets/:id', element: <views.AssetsDetail /> },
  { path: '/transactions', element: <views.Transactions /> },
  { path: '/transactions/:id', element: <views.TransactionDetail /> },
  { path: '/address/:id', element: <views.Address /> },
  { path: '/domain/:id', element: <views.Domain /> },
  { path: '/contracts', element: <views.Contracts /> },
  { path: '*', element: <views.NotFound /> },
]
