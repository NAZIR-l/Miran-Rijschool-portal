<template>
  <q-page class="terms-page">
    <div class="container">
      <header class="page-header">
        <h1 class="title">{{ $t('terms.title') }}</h1>
        <p class="subtitle">{{ $t('terms.subtitle') }}</p>
      </header>

      <section class="card">
        <h2 class="section-title">{{ $t('terms.company_info.title') }}</h2>
        <ul class="info-list">
          <li><strong>{{ $t('terms.company_info.name') }}:</strong> Miranrijschool</li>
          <li><strong>{{ $t('terms.company_info.address') }}:</strong> Koninginneweg 198, 2941 XP Lekkerkerk</li>
          <li><strong>{{ $t('terms.company_info.kvk') }}:</strong> 96736461</li>
          <li><strong>{{ $t('terms.company_info.vat') }}:</strong> NL005228312B62</li>
          <li><strong>{{ $t('terms.company_info.email') }}:</strong> <a href="mailto:info@miranrijschool.nl">info@miranrijschool.nl</a></li>
          <li><strong>{{ $t('terms.company_info.phone') }}:</strong> +31 6 86300588</li>
        </ul>
      </section>

      <section class="card">
        <h2 class="section-title">{{ $t('terms.applicability.title') }}</h2>
        <p class="paragraph">
          {{ $t('terms.applicability.body') }}
        </p>
      </section>

      <section class="card">
        <h2 class="section-title">{{ $t('terms.services.title') }}</h2>
        <p class="paragraph">
          {{ $t('terms.services.body') }}
        </p>
      </section>

      <section class="card">
        <h2 class="section-title">{{ $t('terms.prices.title') }}</h2>
        <p class="paragraph">
          {{ $t('terms.prices.body') }}
        </p>
      </section>

      <section class="card">
        <h2 class="section-title">{{ $t('terms.payment.title') }}</h2>
        <ul class="dot-list">
          <li>{{ $t('terms.payment.body_1') }}</li>
          <li>{{ $t('terms.payment.body_2') }}</li>
        </ul>
      </section>

      <section class="card">
        <h2 class="section-title">{{ $t('terms.cancellation.title') }}</h2>
        <ul class="dot-list">
          <li>{{ $t('terms.cancellation.body_1') }}</li>
          <li>{{ $t('terms.cancellation.body_2') }}</li>
          <li>{{ $t('terms.cancellation.body_3') }}</li>
        </ul>
      </section>

      <section class="card">
        <h2 class="section-title">{{ $t('terms.liability.title') }}</h2>
        <p class="paragraph">
          {{ $t('terms.liability.body') }}
        </p>
      </section>

      <section class="card">
        <h2 class="section-title">{{ $t('terms.complaints.title') }}</h2>
        <p class="paragraph">
          {{ $t('terms.complaints.body') }}
        </p>
      </section>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'TermsPage'
}
</script>

<style scoped>
.terms-page {
  padding: 20px;
}
.container {
  max-width: 900px;
  margin: 0 auto;
}
.page-header {
  margin-bottom: 20px;
}
.title {
  margin: 0 0 4px 0;
  font-size: clamp(22px, 2.4vw, 32px);
  font-weight: 800;
  color: #0f172a;
}
.subtitle {
  margin: 0;
  color: #64748b;
  font-size: clamp(14px, 1.4vw, 16px);
}
.card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,.06);
}
.section-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 800;
  color: #111827;
}
.paragraph {
  margin: 0;
  color: #374151;
  line-height: 1.7;
}
.info-list {
  margin: 0;
  padding-left: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}
.dot-list {
  margin: 0;
  padding-left: 18px;
}
.dot-list li {
  margin: 8px 0;
}
@media (max-width: 600px) {
  .terms-page { padding: 14px; }
  .card { padding: 16px; }
}
</style>


