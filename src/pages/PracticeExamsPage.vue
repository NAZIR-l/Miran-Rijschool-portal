<template>
  <q-page class="exams-page">
    <div class="exams">
      <div class="exams-header">
        <div class="header-content">
          <h2>{{ $t('practice.title') }}</h2>
          
          <!-- Course Filter Dropdown -->
          <div class="course-filter">
            <q-select
              v-model="selectedCourse"
              :options="courseOptions"
              outlined
              dense
              emit-value
              map-options
              class="course-select"
              :label="$t('practice.filter_by_course') || 'Filter by Course'"
              @update:model-value="filterExamsByCourse"
            >
              <template v-slot:prepend>
                <q-icon name="filter_list" color="primary" />
              </template>
              <template v-slot:selected>
                <div class="selected-course" v-if="selectedCourse">
                  <q-icon :name="getCourseIcon(selectedCourse)" size="18px" class="course-icon" />
                  <span>{{ getCourseLabel(selectedCourse) }}</span>
                </div>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="course-option">
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.icon" color="primary" size="20px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="exams-body">
        <div class="loading-state">
          <q-spinner color="primary" size="50px" />
          <p>{{ $t('practice.loading') || 'Loading exams...' }}</p>
        </div>
      </div>

      <!-- Empty State - No Courses -->
      <div v-else-if="courses.length === 0" class="exams-body">
        <div class="empty-state">
          <q-icon name="school" size="60px" color="grey-4" />
          <h3>{{ $t('practice.no_enrolled_courses') || 'No Enrolled Courses' }}</h3>
          <p>{{ $t('practice.no_enrolled_courses_text') || 'You need to enroll in a course first to access practice exams.' }}</p>
          <q-btn 
            color="primary" 
            unelevated 
            no-caps 
            :label="$t('practice.browse_courses') || 'Browse Courses'"
            @click="() => router.push('/courses')"
            icon="shopping_cart"
          />
        </div>
      </div>

      <!-- Empty State - No Exams -->
      <div v-else-if="exams.length === 0" class="exams-body">
        <div class="empty-state">
          <q-icon name="quiz" size="60px" color="grey-4" />
          <p>{{ $t('practice.no_exams') || 'No exams available' }}</p>
        </div>
      </div>

      <!-- Exams Grid -->
      <div v-else class="exams-body">
        <div class="exams-grid">
          <div class="exam-item" v-for= "(exam, idx) in exams" :key="exam.id">
            <div class="item-left">
              <div class="exam-number">{{ String(idx + 1).padStart(2, '0') }}</div>
              <!-- متصلة مع بعض -->
              <div class="exam-progress" :class="statusClass(exam.id)">
              <div class="status-chip" :class="statusClass(exam.id)">
                <div class="status-icon">{{ statusIcon(exam.id) }}</div>
                <span>{{ $t('practice.status.' + statusKey(exam.id)) }}</span>
                </div>
                <div class="status-bar" :class="statusClass(exam.id)"></div>
              </div>
            </div>
            <div class="item-right">
              <q-btn  flat no-caps color="primary" class="link" @click="go(exam.id)">{{ $t('practice.actions.start') }}</q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "PracticeExamsPage",
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const { locale, t } = useI18n();
    const allExams = ref([]);
    const exams = ref([]);
    const courses = ref([]);
    const loading = ref(true);
    const selectedCourse = ref(null);

    // Fetch user's active courses from API
    async function fetchCourses() {
      try {
        const response = await api.get("/exams/my-courses");
        
        // Extract course data from enrollments
        const enrolledCourses = response.data.map(enrollment => ({
          id: enrollment.course.id,
          code: enrollment.course.code,
          type: enrollment.course.type,
          name: enrollment.course.name,
          description: enrollment.course.description,
          examsCount: enrollment.course.examsCount,
          enrollmentId: enrollment.enrollmentId,
          enrolledAt: enrollment.enrolledAt,
          expiresAt: enrollment.expiresAt,
          progress: enrollment.progress
        }));
        
        courses.value = enrolledCourses;
        
        console.log('Loaded user enrolled courses:', enrolledCourses);
        return enrolledCourses;
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
        // If not authenticated or error, fallback to empty
        courses.value = [];
        return [];
      }
    }

    // Fetch exams from API
    async function fetchExams() {
      try {
        loading.value = true;
        
        // Fetch both courses and exams
        const userCourses = await fetchCourses();
        const response = await api.get("/exams/list");
        allExams.value = response.data || [];
        
        // Set first course as default if available
        if (userCourses.length > 0) {
          selectedCourse.value = userCourses[0].id;
          // Filter exams by first course
          exams.value = allExams.value.filter(exam => exam.courseId === userCourses[0].id);
        } else {
          exams.value = allExams.value;
        }
      } catch (error) {
        console.error("Failed to fetch exams:", error);
        $q.notify({
          type: "negative",
          message: "Failed to load exams. Please try again.",
          position: "top",
        });
      } finally {
        loading.value = false;
      }
    }

    // Course dropdown options (without "All Courses" option)
    const courseOptions = computed(() => {
      const options = [];
      
      courses.value.forEach(course => {
        // Handle multilingual course names
        let courseName = course.name;
        if (typeof courseName === 'object') {
          courseName = courseName[locale.value] || courseName.nl || courseName.en || course.code;
        }
        
        options.push({
          label: courseName || course.code,
          value: course.id,
          icon: getCourseIcon(course.type)
        });
      });
      
      return options;
    });

    // Filter exams by selected course
    function filterExamsByCourse(courseId) {
      if (courseId) {
        exams.value = allExams.value.filter(exam => exam.courseId === courseId);
      } else {
        exams.value = [];
      }
    }

    // Get course icon based on type
    function getCourseIcon(type) {
      const icons = {
        'manual': 'drive_eta',
        'automatic': 'directions_car',
        'retake': 'refresh'
      };
      return icons[type] || 'school';
    }

    // Get course label
    function getCourseLabel(courseId) {
      if (!courseId) return '';
      const course = courses.value.find(c => c.id === courseId);
      
      if (!course) return '';
      
      // Handle multilingual course names
      let courseName = course.name;
      if (typeof courseName === 'object') {
        courseName = courseName[locale.value] || courseName.nl || courseName.en || course.code;
      }
      
      return courseName || course.code;
    }

    // Status functions
    function statusClass(examId) {
      if (examId === "1") return "failed";
      return "new";   
    }

    function statusIcon(examId) {
      if (examId === "1") return "😕";
      return "👀";
    }

    function statusKey(examId) {
      if (examId === "1") return "failed";
      return "new";
    }

    function go(examId) {
      try {
        router.push(`/exam/${examId}`);
      } catch (e) {
        console.error("Navigation error:", e);
      }
    }

    // Get localized title
    function getExamTitle(exam) {
      if (!exam?.title) return "Exam";
      if (typeof exam.title === "object") {
        return exam.title[locale.value] || exam.title.nl || exam.title.en || "Exam";
      }
      return exam.title;
    }

    onMounted(() => {
      fetchExams();
    });

    return {
      exams,
      courses,
      loading,
      selectedCourse,
      courseOptions,
      filterExamsByCourse,
      getCourseIcon,
      getCourseLabel,
      statusClass,
      statusIcon,
      statusKey,
      go,
      getExamTitle,
    };
  },
});
</script>

<style scoped lang="scss">
.exams-page {
  display: flex;
  justify-content: center;
}

.exams {
  width: 100%;
  margin-top: 20px;
  background: #fff;
  height: max-content;
  border-radius: 12px;
  border-top: 5px solid #2b3bff;
  padding: 0 5%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
.q-page {
  min-height: max-content !important;
}
.exams-header {
  padding: 18px 22px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.exams-header h2 {
  font-size: 18px;
  color: #281931;
  margin: 0;
  font-weight: 700;
  flex: 1;
  min-width: 200px;
}

/* Course Filter Dropdown */
.course-filter {
  min-width: 240px;
  max-width: 320px;
}

.course-select {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  
  :deep(.q-field__control) {
    height: 42px;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #2b3bff;
      box-shadow: 0 2px 8px rgba(43, 59, 255, 0.1);
    }
    
    &:before {
      border: none;
    }
  }
  
  :deep(.q-field__control-container) {
    padding-top: 0;
  }
  
  :deep(.q-field__label) {
    color: #64748b;
    font-weight: 500;
    font-size: 13px;
  }
  
  :deep(.q-field__native) {
    padding-left: 8px;
    color: #0f172a;
    font-weight: 600;
  }
  
  :deep(.q-field__prepend) {
    padding-right: 8px;
  }
}

.selected-course {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0f172a;
  font-weight: 600;
  font-size: 14px;
  
  .course-icon {
    color: #2b3bff;
  }
}

/* Dropdown options styling */
:deep(.course-option) {
  padding: 12px 16px;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 8px;
  
  &:hover {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    transform: translateX(4px);
  }
  
  .q-item__section--avatar {
    min-width: 36px;
  }
  
  .q-item__label {
    font-weight: 500;
    color: #334155;
  }
}

/* Responsive adjustments */
@media (max-width: 820px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .exams-header h2 {
    min-width: auto;
  }
  
  .course-filter {
    min-width: 100%;
    max-width: 100%;
  }
}

.exams-body {
  padding: 18px 10px 24px;
  margin: 0px 1px;
}

/* Loading and Empty States */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  text-align: center;
}

.loading-state p, .empty-state p {
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
  margin: 0;
}

/* شبكة 2 أعمدة */
.exams-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 28px;
}

@media (max-width: 900px) {
  .exams-grid {
    grid-template-columns: 1fr;
  }
}

/* Mobile-friendly paddings so rows can span full width */
@media (max-width: 820px) {
  .exams {
    width: 100%;
    margin: 12px;
    padding: 0;
  }
  .exams-header { 
    padding: 14px 16px 12px;
    border-bottom: 1px solid #f1f5f9;
  }
  .exams-body { padding: 14px 16px 16px; margin: 0; }
  .exams-grid { grid-template-columns: 1fr; }
}

.exam-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 24px;
  padding: 16px 18px 16px 24px;
  min-width: 0;
  overflow: hidden;
  width: 100%;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

/* الرقم */
.exam-number {
  font-weight: 500;
  font-size: 16px;
  color: #0f172a;
}

/* البار والستاتس قطعة واحدة */
.exam-progress {
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
  border-radius: 22px;
}

.status-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;
  padding: 6px 10px 6px 6px;
  border-radius: 22px 0 0 22px;
}

.status-icon {
  display: inline-flex;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  background: #fff7ed;
  border: 2px solid #ff7300;
}

.status-bar {
  flex: 1;
  height: 40px;
  border-radius: 0 22px 22px 0;
}

/* حالات */
.status-chip.failed {
  color: #d13c00;
  background: #ffe9df;
}
.status-bar.failed {
  background: #ffe6de;
}
.status-chip.new {
  color: #1f2937;
  background: #e7e9ef;
}
.status-bar.new {
  background: #e6e9ee;
}

/* زر */
.item-right .link {
  font-weight: 600;
  position: relative;
}
.item-right .link::after {
  content: "";
  display: block;
  height: 2px;
  background: #2b3bff;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}
.item-right .link:hover::after {
  transform: scaleX(1);
}
</style>
