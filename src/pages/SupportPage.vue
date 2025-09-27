<template>
  <q-page class="home-bg">
    <div class="support-page">
      <!-- Quick links -->
      <div class="quick card-surface">
        <div class="header">
          <h2>Support & Help</h2>
          <div class="sub">
            We’re here to help. Choose a quick option or browse FAQs.
          </div>
        </div>
        <div class="links">
          <q-btn color="primary" no-caps icon="call" label="Call us" outline />
        </div>
      </div>


      <div class="faq card-surface">
        <div class="card-title">Frequently asked questions</div>
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
              <h3>Contact Our Support Team</h3>
              <p>We're here to help. Send us a detailed message and we'll get back to you within 24 hours.</p>
            </div>
          </div>
        </div>
        
        <q-form @submit.prevent="submit" class="contact-form">
          <div class="form-section">
            <div class="section-label">
              <q-icon name="person" size="18px" />
              <span>Personal Information</span>
            </div>
            <div class="form-row">
              <q-input
                v-model="form.name"
                label="Full Name"
                outlined
                class="form-field"
                :rules="[(v) => !!v || 'Full name is required']"
                hint="Enter your first and last name"
              >
                <template v-slot:prepend>
                  <q-icon name="badge" />
                </template>
              </q-input>
              <q-input
                v-model="form.email"
                label="Email Address"
                outlined
                type="email"
                class="form-field"
                :rules="[
                  (v) => !!v || 'Email is required',
                  (v) => /.+@.+\..+/.test(v) || 'Please enter a valid email'
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
              <span>Inquiry Details</span>
            </div>
            <div class="form-row">
              <q-select
                v-model="form.topic"
                :options="topicOptions"
                label="Topic Category"
                outlined
                class="form-field"
                emit-value
                map-options
                :rules="[(v) => !!v || 'Please select a topic']"
              >
                <template v-slot:prepend>
                  <q-icon name="category" />
                </template>
              </q-select>
              <q-input
                v-model="form.orderId"
                label="Order ID"
                outlined
                class="form-field"
                hint="Optional - helps us locate your order faster"
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
              <span>Your Message</span>
            </div>
            <q-input
              v-model="form.message"
              label="Describe your inquiry in detail"
              type="textarea"
              outlined
              class="message-field"
              :autogrow="true"
              :rows="6"
              :rules="[
                (v) => !!v || 'Please provide a detailed message',
                (v) => v.length >= 10 || 'Message must be at least 10 characters'
              ]"
              hint="Please provide as much detail as possible to help us assist you better"
              counter
              maxlength="1000"
            />
          </div>

          <div class="form-actions">
            <div class="action-info">
              <q-icon name="info" size="16px" color="grey-6" />
              <span class="info-text">Expected response time: 2-24 hours</span>
            </div>
            <div class="button-group">
              <q-btn
                color="grey-5"
                text-color="grey-8"
                unelevated
                no-caps
                icon="refresh"
                label="Reset Form"
                @click="resetForm"
                class="reset-btn"
              />
              <q-btn
                color="primary"
                type="submit"
                unelevated
                no-caps
                icon="send"
                label="Send Message"
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
        message: "Form has been reset",
        position: "top"
      });
    }
    
    async function submit() {
      submitting.value = true;
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        $q.notify({
          type: "positive",
          message: "Thank you! Your message has been sent successfully.",
          caption: "Our support team will respond within 24 hours.",
          position: "top-right",
          timeout: 5000,
          actions: [
            { label: "Dismiss", color: "white", handler: () => {} }
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
          message: "Failed to send message. Please try again.",
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


