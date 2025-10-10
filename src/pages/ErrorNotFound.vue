<template>
  <div class=" text-center flex flex-center">
    <div class="containtError">
      <div class="text-h2 ErrorType" style="opacity:1">
        {{ $t('not_found.title') }}
      </div>
      <div class="text-h6 ErrorBody">
        {{ $t('not_found.body') }}
      </div>

        <router-link to="/">
         <div class="BackHome">
         <button>
          {{ $t('not_found.back_home') }}
        </button>
        </div>
        </router-link>

    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound'
})
</script>
<style scoped>
.q-footer .footer-container{
  color:red;
}
:root {
  --primary: #043CA1;
}
.q-page-container {
  padding-bottom: 0px;
  padding-top: 4%;
}

.q-page-container .text-center {
  background: #F5F8FF;
  width: 100%;
  padding-top: 8%;
  padding-bottom: 11%;
}

.containtError {
  max-width: 90% ;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.containtErrorimage {
  font-size: 13vh;
}

.containtErrorimage img {
  width: 100%;
}

.ErrorType {
  opacity: 1;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 36px;
  line-height: 44px;
  color: #000000;
}

.ErrorBody {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 32px;
  text-align: center;
  text-transform: capitalize;
  color: #000000;
}
@media (max-width:768px){
  .ErrorBody {
    font-size: 14px;
  }
  .ErrorType{
    font-weight: 500;
font-size: 28px;
  }
}
.BackHome {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 18px 16px;
  gap: 10px;
  border: 1px solid #043CA1;
  border-radius: 100px;
  justify-content: center;
}

.BackHome button {
  border: none;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 22px;
    color: #043CA1;
    background: #F5F8FF;
}
.BackHome:hover button {
background: var(--primary);
color: white;
}
.BackHome:hover {
background: var(--primary);

}
div{
  margin-bottom:2% ;
}
</style>