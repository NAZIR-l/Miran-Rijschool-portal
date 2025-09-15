<template>
  <q-page class="account-page">
    <div class="account-container">
      <div class="account-card">
        <h2 class="account-title">{{ $t('account.title') }}</h2>
        <form class="account-form">
          <div class="form-grid">
            <div class="banner banner--tip">
              Maak je account compleet en maak kans op een leuke goodie bag. We
              versturen er 5 per dag! 🤩
            </div>
            <div class="field">
              <span>{{ $t('account.first_name') }}</span><input type="string" name="firstName" />
            </div>
            <div class="field">
              <span>{{ $t('account.last_name') }}</span><input type="string" name="lastName" />
            </div>
            <div class="field">
              <span>{{ $t('account.birth_date') }}</span><input type="date" name="birthDate" />
            </div>
            <div class="field">
              <span>{{ $t('account.phone') }}</span><input type="tel" name="phone" />
            </div>
            <div class="field full-width">
              <span>{{ $t('account.country') }}</span
              ><select name="countryCode">
                <option value="AF">Afghanistan</option>
                <option value="AX">Åland</option>
                <option value="AL">Albanië</option>
                <option value="DZ">Algerije</option>
                <option value="VI">Amerikaanse Maagdeneilanden</option>
                <option value="AS">Amerikaans-Samoa</option>
                <option value="AD">Andorra</option>
                <option value="AO">Angola</option>
                <option value="AI">Anguilla</option>
                <option value="AQ">Antarctica</option>
                <option value="AG">Antigua en Barbuda</option>
                <option value="AR">Argentinië</option>
                <option value="AM">Armenië</option>
                <option value="AW">Aruba</option>
                <option value="AU">Australië</option>
                <option value="AZ">Azerbeidzjan</option>
                <option value="BS">Bahama's</option>
                <option value="BH">Bahrein</option>
                <option value="BD">Bangladesh</option>
                <option value="BB">Barbados</option>
                <option value="BE">België</option>
                <option value="BZ">Belize</option>
                <option value="BJ">Benin</option>
                <option value="BM">Bermuda</option>
                <option value="BT">Bhutan</option>
                <option value="BO">Bolivia</option>
                <option value="BA">Bosnië en Herzegovina</option>
                <option value="BW">Botswana</option>
                <option value="BV">Bouvet</option>
                <option value="BR">Brazilië</option>
                <option value="VG">Britse Maagdeneilanden</option>
                <option value="IO">Brits Indische Oceaanterritorium</option>
                <option value="BN">Brunei</option>
                <option value="BG">Bulgarije</option>
                <option value="BF">Burkina Faso</option>
                <option value="BI">Burundi</option>
                <option value="KH">Cambodja</option>
                <option value="CA">Canada</option>
                <option value="BQ">Caribisch Nederland</option>
                <option value="CF">Centraal-Afrikaanse Republiek</option>
                <option value="CL">Chili</option>
                <option value="CN">China</option>
                <option value="CX">Christmaseiland</option>
                <option value="CC">Cocoseilanden</option>
                <option value="CO">Colombia</option>
                <option value="KM">Comoren</option>
                <option value="CG">Congo-Brazzaville</option>
                <option value="CD">Congo-Kinshasa</option>
                <option value="CK">Cookeilanden</option>
                <option value="CR">Costa Rica</option>
                <option value="CU">Cuba</option>
                <option value="CW">Curaçao</option>
                <option value="CY">Cyprus</option>
                <option value="DK">Denemarken</option>
                <option value="DJ">Djibouti</option>
                <option value="DM">Dominica</option>
                <option value="DO">Dominicaanse Republiek</option>
                <option value="DE">Duitsland</option>
                <option value="EC">Ecuador</option>
                <option value="EG">Egypte</option>
                <option value="SV">El Salvador</option>
                <option value="GQ">Equatoriaal-Guinea</option>
                <option value="ER">Eritrea</option>
                <option value="EE">Estland</option>
                <option value="ET">Ethiopië</option>
                <option value="FO">Faeröer</option>
                <option value="FK">Falklandeilanden</option>
                <option value="FJ">Fiji</option>
                <option value="PH">Filipijnen</option>
                <option value="FI">Finland</option>
                <option value="FR">Frankrijk</option>
                <option value="TF">Franse Zuidelijke Gebieden</option>
                <option value="GF">Frans-Guyana</option>
                <option value="PF">Frans-Polynesië</option>
                <option value="GA">Gabon</option>
                <option value="GM">Gambia</option>
                <option value="GE">Georgië</option>
                <option value="GH">Ghana</option>
                <option value="GI">Gibraltar</option>
                <option value="GD">Grenada</option>
                <option value="GR">Griekenland</option>
                <option value="GL">Groenland</option>
                <option value="GP">Guadeloupe</option>
                <option value="GU">Guam</option>
                <option value="GT">Guatemala</option>
                <option value="GG">Guernsey</option>
                <option value="GN">Guinee</option>
                <option value="GW">Guinee-Bissau</option>
                <option value="GY">Guyana</option>
                <option value="HT">Haïti</option>
                <option value="HM">Heard en McDonaldeilanden</option>
                <option value="HN">Honduras</option>
                <option value="HU">Hongarije</option>
                <option value="HK">Hongkong</option>
                <option value="IE">Ierland</option>
                <option value="IS">IJsland</option>
                <option value="IN">India</option>
                <option value="ID">Indonesië</option>
                <option value="IQ">Irak</option>
                <option value="IR">Iran</option>
                <option value="IL">Israël</option>
                <option value="IT">Italië</option>
                <option value="CI">Ivoorkust</option>
                <option value="JM">Jamaica</option>
                <option value="JP">Japan</option>
                <option value="YE">Jemen</option>
                <option value="JE">Jersey</option>
                <option value="JO">Jordanië</option>
                <option value="KY">Kaaimaneilanden</option>
                <option value="CV">Kaapverdië</option>
                <option value="CM">Kameroen</option>
                <option value="KZ">Kazachstan</option>
                <option value="KE">Kenia</option>
                <option value="KG">Kirgizië</option>
                <option value="KI">Kiribati</option>
                <option value="UM">
                  Kleine afgelegen eilanden van de Verenigde Staten
                </option>
                <option value="KW">Koeweit</option>
                <option value="HR">Kroatië</option>
                <option value="LA">Laos</option>
                <option value="LS">Lesotho</option>
                <option value="LV">Letland</option>
                <option value="LB">Libanon</option>
                <option value="LR">Liberia</option>
                <option value="LY">Libië</option>
                <option value="LI">Liechtenstein</option>
                <option value="LT">Litouwen</option>
                <option value="LU">Luxemburg</option>
                <option value="MO">Macau</option>
                <option value="MG">Madagaskar</option>
                <option value="MW">Malawi</option>
                <option value="MV">Malediven</option>
                <option value="MY">Maleisië</option>
                <option value="ML">Mali</option>
                <option value="MT">Malta</option>
                <option value="IM">Man</option>
                <option value="MA">Marokko</option>
                <option value="MH">Marshalleilanden</option>
                <option value="MQ">Martinique</option>
                <option value="MR">Mauritanië</option>
                <option value="MU">Mauritius</option>
                <option value="YT">Mayotte</option>
                <option value="MX">Mexico</option>
                <option value="FM">Micronesië</option>
                <option value="MD">Moldavië</option>
                <option value="MC">Monaco</option>
                <option value="MN">Mongolië</option>
                <option value="ME">Montenegro</option>
                <option value="MS">Montserrat</option>
                <option value="MZ">Mozambique</option>
                <option value="MM">Myanmar</option>
                <option value="NA">Namibië</option>
                <option value="NR">Nauru</option>
                <option value="NL">Nederland</option>
                <option value="NP">Nepal</option>
                <option value="NI">Nicaragua</option>
                <option value="NC">Nieuw-Caledonië</option>
                <option value="NZ">Nieuw-Zeeland</option>
                <option value="NE">Niger</option>
                <option value="NG">Nigeria</option>
                <option value="NU">Niue</option>
                <option value="MP">Noordelijke Marianen</option>
                <option value="KP">Noord-Korea</option>
                <option value="MK">Noord-Macedonië</option>
                <option value="NO">Noorwegen</option>
                <option value="NF">Norfolk</option>
                <option value="UG">Oeganda</option>
                <option value="UA">Oekraïne</option>
                <option value="UZ">Oezbekistan</option>
                <option value="OM">Oman</option>
                <option value="AT">Oostenrijk</option>
                <option value="TL">Oost-Timor</option>
                <option value="PK">Pakistan</option>
                <option value="PW">Palau</option>
                <option value="PS">Palestina</option>
                <option value="PA">Panama</option>
                <option value="PG">Papoea-Nieuw-Guinea</option>
                <option value="PY">Paraguay</option>
                <option value="PE">Peru</option>
                <option value="PN">Pitcairneilanden</option>
                <option value="PL">Polen</option>
                <option value="PT">Portugal</option>
                <option value="PR">Puerto Rico</option>
                <option value="QA">Qatar</option>
                <option value="RE">Réunion</option>
                <option value="RO">Roemenië</option>
                <option value="RU">Rusland</option>
                <option value="RW">Rwanda</option>
                <option value="BL">Saint-Barthélemy</option>
                <option value="KN">Saint Kitts en Nevis</option>
                <option value="LC">Saint Lucia</option>
                <option value="PM">Saint-Pierre en Miquelon</option>
                <option value="VC">Saint Vincent en de Grenadines</option>
                <option value="SB">Salomonseilanden</option>
                <option value="WS">Samoa</option>
                <option value="SM">San Marino</option>
                <option value="SA">Saoedi-Arabië</option>
                <option value="ST">Sao Tomé en Principe</option>
                <option value="SN">Senegal</option>
                <option value="RS">Servië</option>
                <option value="SC">Seychellen</option>
                <option value="SL">Sierra Leone</option>
                <option value="SG">Singapore</option>
                <option value="SH">
                  Sint-Helena, Ascension en Tristan da Cunha
                </option>
                <option value="MF">Saint-Martin</option>
                <option value="SX">Sint Maarten</option>
                <option value="SI">Slovenië</option>
                <option value="SK">Slowakije</option>
                <option value="SD">Soedan</option>
                <option value="SO">Somalië</option>
                <option value="ES">Spanje</option>
                <option value="SJ">Spitsbergen en Jan Mayen</option>
                <option value="LK">Sri Lanka</option>
                <option value="SR">Suriname</option>
                <option value="SZ">Swaziland</option>
                <option value="SY">Syrië</option>
                <option value="TJ">Tadzjikistan</option>
                <option value="TW">Taiwan</option>
                <option value="TZ">Tanzania</option>
                <option value="TH">Thailand</option>
                <option value="TG">Togo</option>
                <option value="TK">Tokelau</option>
                <option value="TO">Tonga</option>
                <option value="TT">Trinidad en Tobago</option>
                <option value="TD">Tsjaad</option>
                <option value="CZ">Tsjechië</option>
                <option value="TN">Tunesië</option>
                <option value="TR">Turkije</option>
                <option value="TM">Turkmenistan</option>
                <option value="TC">Turks- en Caicoseilanden</option>
                <option value="TV">Tuvalu</option>
                <option value="UY">Uruguay</option>
                <option value="VU">Vanuatu</option>
                <option value="VA">Vaticaanstad</option>
                <option value="VE">Venezuela</option>
                <option value="AE">Verenigde Arabische Emiraten</option>
                <option value="US">Verenigde Staten</option>
                <option value="GB">Verenigd Koninkrijk</option>
                <option value="VN">Vietnam</option>
                <option value="WF">Wallis en Futuna</option>
                <option value="EH">Westelijke Sahara/SADR</option>
                <option value="BY">Wit-Rusland</option>
                <option value="ZM">Zambia</option>
                <option value="ZW">Zimbabwe</option>
                <option value="ZA">Zuid-Afrika</option>
                <option value="GS">
                  Zuid-Georgia en de Zuidelijke Sandwicheilanden
                </option>
                <option value="KR">Zuid-Korea</option>
                <option value="SS">Zuid-Soedan</option>
                <option value="SE">Zweden</option>
                <option value="CH">Zwitserland</option>
              </select>
            </div>
            <div class="field" data-error="false">
              <span>{{ $t('account.postal_code') }}</span
              ><input id="postCodeInput" type="text" name="postalCode" />
            </div>
            <div class="field" data-error="false">
              <span>{{ $t('account.address2') }}</span
              ><input type="text" name="address2" />
            </div>

            <div class="field full-width">
              <span>{{ $t('account.street') }}</span><input type="text" name="address1" />
            </div>
            <div class="field full-width">
              <span>{{ $t('account.city') }}</span><input type="text" name="city" />
            </div>
            <input type="hidden" name="province" value="dummie" />
            <div class="field full-width email">
              <span>{{ $t('account.email') }}</span><input type="email" name="email" />
            </div>
            <h2 class="section-title">{{ $t('account.section_login_with') }}</h2>
            <div class="field full-width password">
              <span>{{ $t('account.password') }}</span
              ><input
                type="password"
                autocomplete="new-password"
                name="newPassword"
              />
            </div>
            <div class="banner banner--warning">{{ $t('account.warning_after_password') }}</div>
            <button type="button" class="oauth-btn oauth-btn--google">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                style="display: block"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              <div style="text-align: left"><span>{{ $t('account.oauth_google') }}</span></div>
            </button>
            <button type="button" class="oauth-btn oauth-btn--apple">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 814 1000"
                style="margin-bottom: 2px"
              >
                <path
                  d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"
                  fill="currentColor"
                ></path>
              </svg>
              <div style="text-align: left"><span>{{ $t('account.oauth_apple') }}</span><br /></div>
            </button>
            <div class="email-preferences">
              <p>{{ $t('account.email_pref_title') }}</p>
              <label
                ><input type="checkbox" name="acceptsMarketing" />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  fill="none"
                  viewBox="0 0 19 19"
                  data-sentry-element="IconCheckbox"
                  data-sentry-source-file="account.tsx"
                >
                  <path stroke="#DDD" d="M.5.5h18v18H.5z"></path>
                  <path
                    fill="#0047FD"
                    fill-rule="evenodd"
                    d="M6.687 15c.375 0 .73-.145.994-.406l9.045-9.014a.92.92 0 0 0 0-1.308.945.945 0 0 0-1.326 0l-8.713 8.686L3.6 9.77a.943.943 0 0 0-1.326 0 .92.92 0 0 0 0 1.31l3.418 3.513c.266.261.617.406.994.406z"
                    clip-rule="evenodd"
                  ></path></svg
                >{{ $t('account.email_pref_label') }}</label
              >
            </div>
            <div class="field" style="margin-top: 32px">
              <span>{{ $t('account.exam_date') }}</span><input type="date" name="examDate" />
            </div>
            <div class="actions">
              <button type="submit" class="btn-primary">{{ $t('account.submit') }}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "AccountPage",
  setup() {
    const countries = [
      { label: "The Netherlands", value: "nl" },
      { label: "Belgium", value: "be" },
      { label: "Germany", value: "de" },
    ];
    const newsletter = ref(false);
    const firstName = ref("");
    const lastName = ref("");
    const birthDate = ref("");
    const phone = ref("");
    const country = ref("nl");
    const postcode = ref("");
    const houseNumber = ref("");
    const street = ref("");
    const city = ref("");
    const email = ref("");
    const password = ref("");
    const examDate = ref("");

    const googleLoading = ref(false);
    const appleLoading = ref(false);

    function handleOauthClick(provider) {
      if (provider === "google") {
        googleLoading.value = true;
        setTimeout(() => {
          googleLoading.value = false;
        }, 1100);
      } else {
        appleLoading.value = true;
        setTimeout(() => {
          appleLoading.value = false;
        }, 1100);
      }
    }

    return {
      countries,
      newsletter,
      firstName,
      lastName,
      birthDate,
      phone,
      country,
      postcode,
      houseNumber,
      street,
      city,
      email,
      password,
      examDate,
      googleLoading,
      appleLoading,
      handleOauthClick,
    };
  },
});
</script>

<style scoped lang="scss" src="./account.scss">
</style>


