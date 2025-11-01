<template>
  <q-page class="home-bg">
    <div class="support-page">
      <!-- Quick links -->
      <div class="quick card-surface">
        <div class="header">
          <h2>{{ $t('support.title') }}</h2>
          <div class="sub">
            {{ $t('support.sub') }}
          </div>
        </div>
        <div class="links">
          <q-btn color="primary" no-caps icon="call" :label="$t('support.call_us')" outline />
        </div>
      </div>


      <div class="faq card-surface">
        <div class="card-title">{{ $t('support.faq_title') }}</div>
        <q-expansion-item
          v-for="faq in faqs"
          :key="faq.q"
          expand-icon="add"
          expanded-icon="remove"
          icon="help_outline"
          :label="faq.q"
        >
          <div class="faq-answer">{{ faq.a }}</div>
        </q-expansion-item>
      </div>
      <!-- FAQ -->

      <!-- Contact form -->
      <div class="contact card-surface">
        <div class="contact-header">
          <div class="contact-title">
            <q-icon name="support_agent" size="28px" color="primary" />
            <div>
              <h3>{{ $t('support.contact.title') }}</h3>
              <p>{{ $t('support.contact.subtitle') }}</p>
            </div>
          </div>
        </div>
        
        <q-form @submit.prevent="submit" class="contact-form">
          <div class="form-section">
            <div class="section-label">
              <q-icon name="person" size="18px" />
              <span>{{ $t('support.contact.personal_info') }}</span>
            </div>
            <div class="form-row">
              <q-input
                v-model="form.name"
                :label="$t('support.contact.full_name')"
                outlined
                class="form-field"
                :rules="[(v) => !!v || $t('support.validation.full_name_required')]"
                hint="Enter your first and last name"
              >
                <template v-slot:prepend>
                  <q-icon name="badge" />
                </template>
              </q-input>
              <q-input
                v-model="form.email"
                :label="$t('support.contact.email')"
                outlined
                type="email"
                class="form-field"
                :rules="[
                  (v) => !!v || $t('support.validation.email_required'),
                  (v) => /.+@.+\..+/.test(v) || $t('support.validation.email_invalid')
                ]"
                hint="We'll use this to respond to your inquiry"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
            </div>
          </div>

          <div class="form-section">
            <div class="section-label">
              <q-icon name="help_outline" size="18px" />
              <span>{{ $t('support.contact.inquiry_details') }}</span>
            </div>
            <div class="form-row">
              <q-select
                v-model="form.topic"
                :options="topicOptions"
                :label="$t('support.contact.topic')"
                outlined
                class="form-field"
                emit-value
                map-options
                :rules="[(v) => !!v || $t('support.validation.topic_required')]"
              >
                <template v-slot:prepend>
                  <q-icon name="category" />
                </template>
              </q-select>
              <q-input
                v-model="form.orderId"
                :label="$t('support.contact.order_id')"
                outlined
                class="form-field"
                :hint="$t('support.contact.optional_order_hint')"
              >
                <template v-slot:prepend>
                  <q-icon name="receipt" />
                </template>
              </q-input>
            </div>
          </div>

          <div class="form-section">
            <div class="section-label">
              <q-icon name="message" size="18px" />
              <span>{{ $t('support.contact.your_message') }}</span>
            </div>
            <q-input
              v-model="form.message"
              :label="$t('support.contact.message_placeholder')"
              type="textarea"
              outlined
              class="message-field"
              :autogrow="true"
              :rows="6"
              :rules="[
                (v) => !!v || $t('support.validation.message_required'),
                (v) => v.length >= 10 || $t('support.validation.message_min')
              ]"
              hint="Please provide as much detail as possible to help us assist you better"
              counter
              maxlength="1000"
            />
          </div>

          <div class="form-actions">
            <div class="action-info">
              <q-icon name="info" size="16px" color="grey-6" />
              <span class="info-text">{{ $t('support.contact.response_time') }}</span>
            </div>
            <div class="button-group">
              <q-btn
                color="grey-5"
                text-color="grey-8"
                unelevated
                no-caps
                icon="refresh"
                :label="$t('support.contact.reset_form')"
                @click="resetForm"
                class="reset-btn"
              />
              <q-btn
                color="primary"
                type="submit"
                unelevated
                no-caps
                icon="send"
                :label="$t('support.contact.send_message')"
                class="submit-btn"
                size="md"
                :loading="submitting"
              />
            </div>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
export default defineComponent({
  name: "SupportPage",
  setup() {
    const $q = useQuasar();
    const submitting = ref(false);
    
    const faqs = ref([
      {
        q: "How do I reschedule my exam?",
        a: "Go to Orders > Select exam > Reschedule.",
      },
      {
        q: "How do I upgrade my package?",
        a: "Open Profile & Purchases and click Upgrade package.",
      },
      {
        q: "I forgot my password.",
        a: "Use the Forgot password link on the login page.",
      },
    ]);
    
    const topicOptions = [
      { label: "Account & Login Issues", value: "Account", icon: "person" },
      { label: "Orders & Bookings", value: "Orders", icon: "shopping_cart" },
      { label: "Payments & Billing", value: "Payments", icon: "payment" },
      { label: "Technical Support", value: "Technical", icon: "bug_report" },
      { label: "General Inquiry", value: "Other", icon: "help_outline" }
    ];
    
    const form = ref({
      name: "",
      email: "",
      topic: "Account",
      orderId: "",
      message: "",
    });

    function resetForm() {
      form.value = {
        name: "",
        email: "",
        topic: "Account",
        orderId: "",
        message: "",
      };
        $q.notify({
          type: "info",
          message: $t('support.notify.form_reset'),
          position: "top"
        });
    }
    
    async function submit() {
      submitting.value = true;
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Build WhatsApp message and open chat with prefilled text
        const whatsappNumber = "31686300588"; // +31 6 86300588 without plus/spaces
        const details = [
          "New support inquiry",
          `Name: ${form.value.name}`,
          `Email: ${form.value.email}`,
          `Topic: ${form.value.topic}`,
          form.value.orderId ? `Order ID: ${form.value.orderId}` : null,
          "",
          "Message:",
          form.value.message
        ].filter(Boolean).join("\n");
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(details)}`;
        window.open(whatsappUrl, "_blank");
        
        $q.notify({
          type: "positive",
          message: $t('support.notify.send_ok_title'),
          caption: $t('support.notify.send_ok_caption'),
          position: "top-right",
          timeout: 5000,
          actions: [
            { label: $t('support.notify.dismiss'), color: "white", handler: () => {} }
          ]
        });
        
        // Reset form after successful submission
        form.value = {
          name: "",
          email: "",
          topic: "Account",
          orderId: "",
          message: "",
        };
      } catch (error) {
        $q.notify({
          type: "negative",
          message: $t('support.notify.send_fail'),
          position: "top-right"
        });
      } finally {
        submitting.value = false;
      }
    }
    
    return { 
      faqs, 
      form, 
      topicOptions, 
      submitting,
      submit, 
      resetForm
    };
  },
});
</script>

<style scoped lang="scss" src="../css/support.scss">
</style>


