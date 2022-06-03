const dataUser = JSON.parse(localStorage.getItem('auth.user') as any);
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());

gtag('config', 'G-23254NLRBW', {
  'user_id': dataUser?.clientId ?? '',
  'email': dataUser?.email ?? ''
});

// export default ({ $config: { googleAnalytics } }) => {
//   gtag('config', googleAnalytics.id);
// };