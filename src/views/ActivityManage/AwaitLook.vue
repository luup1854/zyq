<!-- 活动内容查看 -->
<template>
  <div class="activity">
    <div>
      <!-- 菜单 -->
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#fff"
        text-color="#000000"
        active-text-color="#36a0ff"
        @select="handleSelect"
      >
        <el-menu-item index="0" data-name="info">活动信息</el-menu-item>
        <el-menu-item index="1" data-name="content">活动内容</el-menu-item>
        <el-menu-item index="2" data-name="requirements">活动需求</el-menu-item>
      </el-menu>
    </div>

    <el-card class="activity-section" header="活动信息" id="infoCard">
      <div class="activity-info" v-if="activity">
        <h2>{{ activity.name }}</h2>
        <p>时间: {{ activity.time }}</p>
        <p>地点: {{ activity.place }}</p>
        <!-- 其他活动信息内容 -->
      </div>
    </el-card>

    <el-card class="activity-section" header="活动内容" id="contentCard">
      <div class="activity-content">
        <p>{{ activity.content }}</p>
      </div>
    </el-card>

    <el-card class="activity-section" header="活动需求" id="requirementsCard">
      <div class="activity-requirements">
        <p>人数需求: {{ activity.number }}</p>
        <p>活动物资: {{ activity.goods }}</p>
      </div>
    </el-card>

    <div class="buttons">
      <el-button type="primary" @click="approve">通过</el-button>
      <el-button @click="reject">驳回</el-button>
    </div>
    <el-dialog title="驳回原因" v-model="dialogVisible" width="50%"> 
      <el-form :model="form" style="width: 100%">
      <el-form-item label="驳回原因" >
        <el-mention v-model="inputValue"   
    type="textarea"
    style="width: 320px"
    placeholder="请输入" autocomplete="off"  />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleReject">
          确认
        </el-button>
      </div>
    </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getActById } from '../../api/zyb/institution';
import { useRoute } from 'vue-router';
import { campusReviewService } from '@/api/zyb/administration';
import { ElMessage } from 'element-plus';
import router from '@/router';



const route = useRoute();
const activityId = route.query.id;
const activeIndex2 = ref('1')

const init = async () => {
  const res = await getActById(activityId);
  activity.value = res.data
   console.log('activity:',activity.value);
}

const activity = ref({});

// 当组件挂载时加载数据
onMounted(async () => {
  if (activityId) {
    await init();
  }
});


const handleSelect = (index) => {
  if (index === '0') {
    scrollToSection('infoCard');
  } else if (index === '1') {
    scrollToSection('contentCard');
  } else if (index === '2') {
    scrollToSection('requirementsCard');
  }
};

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  section.scrollIntoView({ behavior: 'smooth' });
};

const approve =async () => {
  // 处理通过按钮点击事件
  console.log('待审核,活动通过'   ,activityId,activity.value.state);
  try{
    const res=await campusReviewService(activityId,true)
    console.log(res);
    if(res.code===0){
      ElMessage.success("审核成功")
      router.back()
    }else{
      ElMessage.error("审核失败")
    }
  }catch(error){console.error(error)}
};

//打开对话框
const dialogVisible = ref(false)
const inputValue=ref()
const reject =async () => {
  // 处理驳回按钮点击事件
  console.log('待审核，活动驳回');
  dialogVisible.value=true
};
const handleReject=async ()=>{
  console.log('驳回原因',inputValue.value);
  const res=await campusReviewService(activityId,false,inputValue.value)
  console.log(res);
  if(res.code===0){
    ElMessage.success("审核成功")
    router.back()
  }else{
    ElMessage.error("审核失败")
  }
  dialogVisible.value=false
}
</script>
<style scoped>
.activity {
  margin: 20px;
}

.activity-section {
  margin-bottom: 10px;
}

.buttons {
  text-align: right;
  margin-top: 20px;
}
</style>
