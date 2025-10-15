
const routes = [

  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'login', name: 'Login', component: () => import('pages/LoginPage.vue'), meta: { hideSidebar: true } },
      { path: '', name: 'Dashboard', component: () => import('pages/IndexPage.vue') },
      { path: 'practice-exams', name: 'PracticeExams', component: () => import('pages/PracticeExamsPage.vue') },
      { path: 'downloads', name: 'Downloads', component: () => import('pages/DownloadsPage.vue') },
      { path: 'account', name: 'Account', component: () => import('pages/AccountPage.vue') },
      { path: 'orders', name: 'Orders', component: () => import('pages/OrdersPage.vue') },
      { path: 'courses', name: 'Courses', component: () => import('pages/Courses.vue') },
      { path: 'signals', name: 'Signals', component: () => import('pages/TrafficSignsPage.vue') },
      { path: 'favorites', name: 'Favorites', component: () => import('pages/FavoritesPage.vue') },
      { path: 'profile-purchases', name: 'ProfilePurchases', component: () => import('pages/ProfileAndPurchasesPage.vue') },
      { path: 'support', name: 'Support', component: () => import('pages/SupportPage.vue') },
      { path: 'my-exams', name: 'MyExams', component: () => import('pages/MyExamsPage.vue') },
      { path: 'my-exams/:id', name: 'MyExamDetail', component: () => import('pages/ExamDetailPage.vue') },
      { path: 'payment-return', name: 'PaymentReturn', component: () => import('pages/PaymentReturnPage.vue')},
      { path: 'exam/:id', name: 'ExamIntro', component: () => import('pages/ExamIntroPage.vue'), meta: { hideSidebar: true } },
      { path: 'exam/:id/run', name: 'ExamRun', component: () => import('pages/ExamRunPage.vue'), meta: { hideSidebar: true } },
      { path: 'exam/:id/results', name: 'ExamResults', component: () => import('pages/ExamResultsPage.vue'), meta: { hideSidebar: true } },
      { path: 'exam/:id/results/:attemptId', name: 'ExamResultsWithAttempt', component: () => import('pages/ExamResultsPage.vue'), meta: { hideSidebar: true } },
      { path: 'exam/:id/answers', name: 'ExamAnswers', component: () => import('pages/ExamAnswersPage.vue'), meta: { hideSidebar: true } },
      { path: 'exam/:id/answers/:attemptId', name: 'ExamAnswersWithAttempt', component: () => import('pages/ExamAnswersPage.vue'), meta: { hideSidebar: true } },
      { path: 'terms', name: 'Terms', component: () => import('pages/TermsPage.vue') },
      // { path: 'exam/:id/overview', name: 'ExamOverview', component: () => import('pages/ExamOverviewPage.vue'), meta: { hideSidebar: true } },
      // { path: '/contenfsdfst'sd, component: () => import('pages/content.vue') }

    ]
  },
  // {
  //   path: 'exam',
  //   component: () => import('layouts/ExamLayout.vue'),
  //   children: [
  //     // { path: ':id', name: 'ExamIntro', component: () => import('pages/ExamIntroPage.vue') },
  //     // { path: ':id/run', name: 'ExamRun', component: () => import('pages/ExamIntroPage.vue') }
  //   ]
  // },
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ErrorNotFound.vue') }
    ]
  }
]

export default routes
