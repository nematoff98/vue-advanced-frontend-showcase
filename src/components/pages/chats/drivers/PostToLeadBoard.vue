<script lang="ts" setup>
import PostToLeadBoardModal from '@/components/pages/chats/drivers/PostToLeadBoardModal.vue';
import Icon from '@/components/icon/Icon.vue';
import { Icons } from '@/components/icon/helpers';
import {
  computed,
  ref,
  watch,
  watchEffect,
} from 'vue';
import {
  LeadPost,
  LeadPostListInstance,
  LeadPostStatus,
} from '@/services/lead-post';
import { LoadBoard } from '@/services/driver';
import { useRoute } from 'vue-router';
import { FullLeadInfo } from '@/services/lead';
import { useCan } from '@/utils/permission/can';
import { PermissionEnum } from '@/utils/permission/enums';
import PostToCdModal from '@/components/pages/chats/drivers/PostToCdModal.vue';
import { LeadAddress } from '@/services/lead-address';
import PostToDispatchModal from '@/components/pages/chats/drivers/PostToDispatchModal.vue';
import { DispatchData, DispatchServiceInstance } from '@/services/dispatch';
import { ChatLeadInfoTabs } from '@/services/chat';

const route = useRoute();
const $can = useCan();

interface Props {
  lead?: FullLeadInfo
  addresses?: LeadAddress
  activeTab?: ChatLeadInfoTabs
}

const props = defineProps<Props>();

const openPostModal = ref(false);
const openPostToCDModal = ref(false);
const openPostToDispatchModal = ref(false);
const deleteLoadingById = ref<number>();
const leadDispatchData = ref<DispatchData>();

const postList = ref<LeadPost[]>([]);
const postForModal = ref<LeadPost | undefined>();
const isLoading = ref(false);
const activeLoadBoard = ref<LoadBoard>();

const leadId = computed(() => {
  const validId = Number(route.query.leadId);
  if (!Number.isNaN(validId)) {
    return validId;
  }
  return null;
});

const hasSuperDispatchPost = computed(() => postList.value.some((post) => post.loadBoard === LoadBoard.SUPER_DISPATCH));
const hasCentralDispatchPost = computed(() => postList.value.some((post) => post.loadBoard === LoadBoard.CENTRAL_DISPATCH));

const showPostButtonsArticle = computed(() => $can(PermissionEnum.POST_LEAD) && (!hasSuperDispatchPost.value || !hasCentralDispatchPost.value));

const getLeadPostList = async () => {
  if (!leadId.value) return;
  isLoading.value = true;
  try {
    postList.value = await LeadPostListInstance.getLeadsPostList(+leadId.value);
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const getLeadDispatchedData = async () => {
  if (!leadId.value) return;
  isLoading.value = true;
  try {
    const [data] = await DispatchServiceInstance.getDispatchData(+leadId.value);
    if (data) leadDispatchData.value = data;
    else leadDispatchData.value = undefined;
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const updateData = () => {
  getLeadPostList();
  getLeadDispatchedData();
};

watchEffect(() => {
  if (leadId.value) {
    getLeadPostList();
    getLeadDispatchedData();
  }
});

const repost = (post: LeadPost) => {
  postForModal.value = post;
  if (post.loadBoard === LoadBoard.SUPER_DISPATCH) openPostModal.value = true;
  else openPostToCDModal.value = true;
};

const showPostModal = (loadBoard: LoadBoard) => {
  activeLoadBoard.value = loadBoard;
  postForModal.value = undefined;
  if (loadBoard === LoadBoard.CENTRAL_DISPATCH) openPostToCDModal.value = true;
  else openPostModal.value = true;
};

const openDispatchModal = (post: LeadPost) => {
  openPostToDispatchModal.value = true;
  postForModal.value = post;
};

const deletePost = async (postId: number) => {
  deleteLoadingById.value = postId;
  try {
    await LeadPostListInstance.deleteLeadPost(postId);
    getLeadPostList().then();
  } catch (err) {
    console.error(err);
  } finally {
    deleteLoadingById.value = undefined;
  }
};

const deleteDispatch = async (repostId: number) => {
  try {
    await DispatchServiceInstance.deleteDispatch(repostId);
    getLeadDispatchedData().then();
  } catch (err) {
    console.error(err);
  }
};

watch(() => openPostModal.value, (newValue) => {
  if (!newValue) {
    postForModal.value = undefined;
    activeLoadBoard.value = undefined;
  }
});

watch(() => props.activeTab, (newValue) => {
  if (newValue === ChatLeadInfoTabs.DRIVERS) {
    updateData();
  }
});
</script>

<template>
  <div>
    <a-spin :spinning="isLoading">
      <article
        v-if="showPostButtonsArticle"
        class="bg-white rounded-xl p-3 flex items-center flex-wrap gap-2 mt-4"
      >
        <a-button
          v-if="!hasSuperDispatchPost"
          class="bg-red-400 text-white"
          size="large"
          type="ghost"
          @click="showPostModal(LoadBoard.SUPER_DISPATCH)"
        >
          Post to SD
        </a-button>
        <a-button
          v-if="!hasCentralDispatchPost"
          class="bg-yellow-500 text-white"
          size="large"
          type="ghost"
          @click="showPostModal(LoadBoard.CENTRAL_DISPATCH)"
        >
          Post to CD
        </a-button>
      </article>
      <article
        class="bg-white rounded-xl p-3 mt-4"
        v-for="post in postList"
        :key="`posts-${post.id}`"
      >
        <div class="flex items-center justify-between gap-2">
          <a-button
            v-if="post.status === LeadPostStatus.ERROR"
            class="bg-red-100 text-red-700 green-btn cursor-default"
            size="large"
            type="ghost"
          >
            Error
          </a-button>
          <a-button
            v-else
            class="bg-green-100 text-green-700 green-btn cursor-default"
            size="large"
            type="ghost"
          >
            {{ post.loadBoard === LoadBoard.SUPER_DISPATCH ? 'Posted to SD' : 'Posted to CD' }}
          </a-button>
          <a-button
            v-if="$can(PermissionEnum.RE_POST_LEAD)"
            class="square-btn flex items-center justify-center ms-auto"
            size="large"
            type="primary"
            @click="repost(post)"
          >
            <template #icon>
              <Icon :icon="Icons.EDIT" />
            </template>
          </a-button>
          <a-popconfirm
            v-if="$can(PermissionEnum.DELETE_LEAD_POST)"
            title="Are you sure delete this Post?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="deletePost(post.id)"
          >
            <a-button
              class="square-btn flex items-center justify-center bg-red-400 text-white"
              size="large"
              type="ghost"
              :loading="post.id === deleteLoadingById"
            >
              <template #icon>
                <Icon :icon="Icons.TRASH" />
              </template>
            </a-button>
          </a-popconfirm>
        </div>
        <div v-if="post.loadBoard === LoadBoard.CENTRAL_DISPATCH">
          <div class="mt-2 flex items-center justify-between gap-2">
            <a-button
              v-if="!leadDispatchData?.id"
              class="bg-yellow-500 text-white"
              size="large"
              type="ghost"
              @click="openDispatchModal(post)"
            >
              Dispatch to CD
            </a-button>
            <a-button
              v-else
              class="bg-lime-100 text-lime-700 green-btn cursor-default"
              size="large"
              type="ghost"
            >
              Dispatched to CD
            </a-button>
            <a-button
              v-if="leadDispatchData?.id"
              class="square-btn flex items-center justify-center ms-auto"
              size="large"
              type="primary"
              @click="openDispatchModal(post)"
            >
              <template #icon>
                <Icon :icon="Icons.EDIT" />
              </template>
            </a-button>
            <a-popconfirm
              v-if="leadDispatchData?.id"
              title="Are you sure delete this Dispatched to CD?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deleteDispatch(leadDispatchData.id)"
            >
              <a-button
                class="square-btn flex items-center justify-center bg-red-400 text-white"
                size="large"
                type="ghost"
                :loading="post.id === deleteLoadingById"
              >
                <template #icon>
                  <Icon :icon="Icons.TRASH" />
                </template>
              </a-button>
            </a-popconfirm>
          </div>
          <a
            v-if="leadDispatchData?.dispatchUrl"
            :href="leadDispatchData.dispatchUrl"
            rel="noopener noreferrer"
            target="_blank"
            class="text-primary underline flex items-center gap-1 mt-2"
          >
            <Icon :icon="Icons.EXTERNAL_LINK" size="14" />
            Open in CD
          </a>
        </div>
        <div v-if="post?.bol_url" class="mt-4">
          <a
            :href="post.bol_url"
            class="text-gray-700 font-bold flex items-center gap-1 online-bol-link hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon :icon="Icons.DOCUMENT" />
            Online BOL
          </a>
        </div>
      </article>
    </a-spin>
  </div>
  <PostToLeadBoardModal
    :open="openPostModal"
    :lead-post="postForModal"
    :lead="lead"
    :active-load-board="activeLoadBoard"
    @update:open="openPostModal = $event"
    @update:data="updateData"
  />
  <PostToCdModal
    :open="openPostToCDModal"
    :lead-post="postForModal"
    :lead="lead"
    :addresses="addresses"
    :active-load-board="activeLoadBoard"
    @update:open="openPostToCDModal = $event"
    @update:data="updateData"
  />
  <PostToDispatchModal
    :open="openPostToDispatchModal"
    :lead-dispatch-data="leadDispatchData"
    :lead-post="postForModal"
    :lead="lead"
    :addresses="addresses"
    :active-load-board="activeLoadBoard"
    @update:open="openPostToDispatchModal = $event"
    @update:data="updateData"
  />
</template>

<style lang="scss" scoped>
.green-btn {
  @apply text-xs h-9;
}

.square-btn {
  @apply w-9 h-9 !important;
}

.online-bol-link {
  color: var(--color-primary-500)!important;
}
</style>
