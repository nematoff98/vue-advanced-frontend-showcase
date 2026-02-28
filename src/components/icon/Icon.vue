<template>
  <LucideChartNoAxesCombinedIcon v-if="icon === Icons.LUCIDE_CHART_NO_AXES_COMBINED" :size="size" />
  <MessageSquareTextIcon v-else-if="icon === Icons.MESSAGE_SQUARE_TEXT" :size="size" />
  <SliderHorizontalIcon v-else-if="icon === Icons.SLIDERS_HORIZONTAL" :size="size" />
  <AccountMultipleIcon v-else-if="icon === Icons.ACCOUNT_MULTIPLE" :size="size" />
  <MessageSquareIcon v-else-if="icon === Icons.MESSAGE_SQUARE" :size="size" />
  <ChevronsLeftIcon v-else-if="icon === Icons.CHEVRONS_LEFT" :size="size" />
  <ArrowLeftType v-else-if="icon === Icons.ARROW_LEFT_TYPE" :size="size" />
  <ChatMessageIcon v-else-if="icon === Icons.ChAT_MESSAGE" :size="size" />
  <PhoneIncoming v-else-if="icon === Icons.PHONE_INCOMING" :size="size" />
  <ChevronDownIcon v-else-if="icon === Icons.CHEVRON_DOWN" :size="size" />
  <DotsVertical v-else-if="icon === Icons.DOTS_VERTICAL" :size="size" />
  <CheckCheckIcon v-else-if="icon === Icons.CHECK_CHECK" :size="size" />
  <StatisticsIcon v-else-if="icon === Icons.STATISTICS" :size="size" />
  <MicrophoneIcon v-else-if="icon === Icons.MICROPHONE" :size="size" />
  <MapMarkerIcon v-else-if="icon === Icons.MAP_MARKER" :size="size" />
  <UserCheckIcon v-else-if="icon === Icons.USER_CHECK" :size="size" />
  <ClipboardIcon v-else-if="icon === Icons.CLIPBOARD" :size="size" />
  <PaperclipIcon v-else-if="icon === Icons.PAPERCLIP" :size="size" />
  <ListTodoIcon v-else-if="icon === Icons.LIST_TODO" :size="size" />
  <SettingsIcon v-else-if="icon === Icons.SETTINGS" :size="size" />
  <ActivityIcon v-else-if="icon === Icons.ACTIVITY" :size="size" />
  <CalendarIcon v-else-if="icon === Icons.CALENDAR" :size="size" />
  <DownloadIcon v-else-if="icon === Icons.DOWNLOAD" :size="size" />
  <AiStarsIcon v-else-if="icon === Icons.AI_STARS" :size="size" />
  <AccountIcon v-else-if="icon === Icons.ACCOUNT" :size="size" />
  <CheckAll v-else-if="icon === Icons.CHECK_ALL" :size="size" />
  <LogoIcon v-else-if="icon === Icons.LOGO_ICON" :size="size" />
  <GridIcon v-else-if="icon === Icons.GRID_ICON" :size="size" />
  <SearchIcon v-else-if="icon === Icons.SEARCH" :size="size" />
  <PhoneIcon v-else-if="icon === Icons.PHONE" :size="size" />
  <TasksIcon v-else-if="icon === Icons.TASKS" :size="size" />
  <EmailIcon v-else-if="icon === Icons.EMAIL" :size="size" />
  <TrashIcon v-else-if="icon === Icons.TRASH" :size="size" />
  <CheckIcon v-else-if="icon === Icons.CHECK" :size="size" />
  <TruckIcon v-else-if="icon === Icons.TRUCK" :size="size" />
  <FrameIcon v-else-if="icon === Icons.FRAME" :size="size" />
  <UsersIcon v-else-if="icon === Icons.USERS" :size="size" />
  <VideoIcon v-else-if="icon === Icons.VIDEO" :size="size" />
  <MenuIcon v-else-if="icon === Icons.MENU" :size="size" />
  <BellIcon v-else-if="icon === Icons.BELL" :size="size" />
  <TuneIcon v-else-if="icon === Icons.TUNE" :size="size" />
  <EditIcon v-else-if="icon === Icons.EDIT" :size="size" />
  <ViewIcon v-else-if="icon === Icons.VIEW" :size="size" />
  <SendIcon v-else-if="icon === Icons.SEND" :size="size" />
  <PlusIcon v-else-if="icon === Icons.PLUS" :size="size" />
  <MoonIcon v-else-if="icon === Icons.MOON" :size="size" />
  <PinIcon v-else-if="icon === Icons.PIN" :size="size" />
  <MapIcon v-else-if="icon === Icons.MAP" :size="size" />
  <SunIcon v-else-if="icon === Icons.SUN" :size="size" />
  <CopyIcon v-else-if="icon === Icons.COPY" :size="size" />
  <MonitorIcon v-else-if="icon === Icons.MONITOR" :size="size" />
  <LinkIcon v-else-if="icon === Icons.LINK" :size="size" />
  <CreditCardIcon v-else-if="icon === Icons.CREDIT_CARD" :size="size" />
  <Building2Icon v-else-if="icon === Icons.BUILDING2" :size="size" />
  <ChevronsRightIcon v-else-if="icon === Icons.CHEVRONS_RIGHT" :size="size" />
  <PrinterIcon v-else-if="icon === Icons.PRINTER" :size="size" />
  <RepeatIcon v-else-if="icon === Icons.REPEAT" :size="size" />
  <HotSaleIcon v-else-if="icon === Icons.HOT_SALE" :size="size" />
  <RobotIcon v-else-if="icon === Icons.ROBOT" :size="size" />
  <UserIcon v-else-if="icon === Icons.USER" :size="size" />
  <AlertCircleIcon v-else-if="icon === Icons.ALERT_CIRCLE" :size="size" />
  <PlayIcon v-else-if="icon === Icons.PLAY" :size="size" />
  <PauseIcon v-else-if="icon === Icons.PAUSE" :size="size" />
  <TranscriptionIcon v-else-if="icon === Icons.TRANSCRIPTION" :size="size" />
  <XIcon v-else-if="icon === Icons.X" :size="size" />
  <WarningIcon v-else-if="icon === Icons.WARNING" :size="size" />
  <CircleIcon v-else-if="icon === Icons.CIRCLE" :size="size" />
  <CircleDotIcon v-else-if="icon === Icons.DOT_CIRCLE" :size="size" />
  <RefreshCwIcon v-else-if="icon === Icons.REFRESH_SW" :size="size" />
  <UsdIcon v-else-if="icon === Icons.USD" :size="size" />
  <LockIcon v-else-if="icon === Icons.LOCK" :size="size" />
  <AITextIcon v-else-if="icon === Icons.AI_TEXT" :size="size" />
  <CallIcon v-else-if="icon === Icons.CALL" :size="size" />
  <OutgoingCallIcon v-else-if="icon === Icons.OUTGOING_CALL" :size="size" />
  <IncomingCallIcon v-else-if="icon === Icons.INCOMING_CALL" :size="size" />
  <PhoneOffIcon v-else-if="icon === Icons.PHONE_OFF" :size="size" />
  <CallMissedIcon v-else-if="icon === Icons.MISSED_CALL" :size="size" />
  <CarIcon v-else-if="icon === Icons.CAR" :size="size" />
  <UserFilledIcon v-else-if="icon === Icons.USER_FILLED" :size="size" />
  <ShieldCheckIcon v-else-if="icon === Icons.SHIELD_CHECK" :size="size" />
  <ClockIcon v-else-if="icon === Icons.CLOCK" :size="size" />
  <AIIcon v-else-if="icon === Icons.AI" :size="size" />
  <InfoIcon v-else-if="icon === Icons.INFO" :size="size" />
  <HelpCircleIcon v-else-if="icon === Icons.HELP_CIRCLE" :size="size" />
  <UserPlusIcon v-else-if="icon === Icons.USER_PLUS" :size="size" />
  <DollarSignIcon v-else-if="icon === Icons.DOLLAR_SIGN" :size="size" />
  <InboxIcon v-else-if="icon === Icons.INBOX" :size="size" />
  <FolderIcon v-else-if="icon === Icons.FOLDER" :size="size" />
  <BoxIcon v-else-if="icon === Icons.BOX" :size="size" />
  <LogOutIcon v-else-if="icon === Icons.LOG_OUT" :size="size" />
  <ShieldCheckFull v-else-if="icon === Icons.SHIELD_CHECK_FULL" :size="size" />
  <GoogleAuthenticationIcon v-else-if="icon === Icons.GOOGLE_AUTHENTICATION" :size="size" />
  <TelegramIcon v-else-if="icon === Icons.TELEGRAM" :size="size" />
  <ChevronRightIcon v-else-if="icon === Icons.CHEVRON_RIGHT" :size="size" />
  <UserXIcon v-else-if="icon === Icons.USER_X" :size="size" />
  <TruckOpenIcon v-else-if="icon === Icons.TRUCK_OPEN" :size="size" />
  <ReloadIcon v-else-if="icon === Icons.RELOAD" :size="size" />
  <MoneyIcon v-else-if="icon === Icons.MONEY" :size="size" />
  <OperatingExpensesIcon v-else-if="icon === Icons.OPERATING_EXPENSES" :size="size" />
  <NetProfitIcon v-else-if="icon === Icons.NET_PROFIT" :size="size" />
  <CheckCircleIcon v-else-if="icon === Icons.CHECK_CIRCLE" :size="size" />
  <PhoneCallIcon v-else-if="icon === Icons.PHONE_CALL" :size="size" />
  <ArrowUpRightIcon v-else-if="icon === Icons.ARROW_UP_RIGHT" :size="size" />
  <ArrowDownRightIcon v-else-if="icon === Icons.ARROW_DOWN_RIGHT" :size="size" />
  <RingingCall v-else-if="icon === Icons.RINGING_CALL" :size="size" />
  <KeyboardIcon v-else-if="icon === Icons.KEYBOARD" :size="size" />
  <MicrophoneOff v-else-if="icon === Icons.MICROPHONE_OFF" :size="size" />
  <MinusIcon v-else-if="icon === Icons.MINUS" :size="size" />
  <PhoneOutgoing v-else-if="icon === Icons.PHONE_OUTGOING" :size="size" />
  <ArrowDownLeft v-else-if="icon === Icons.ARROW_DOWN_LEFT" :size="size" />
  <SmsIcon v-else-if="icon === Icons.SMS" :size="size" />
  <WhatsAppIcon v-else-if="icon === Icons.WHATSAPP" :size="size" />
  <LoadingOutlined v-else-if="icon === Icons.LOADING_OUTLINED" :style="{ fontSize: size }" :spin="true" />
  <UploadOutlined v-else-if="icon === Icons.UPLOAD_OUTLINED" :style="{ fontSize: size }" />
  <ExternalLinkIcon v-else-if="icon === Icons.EXTERNAL_LINK" :size="size" />
  <AiCallIcon v-else-if="icon === Icons.AI_CALL" :size="size" />
  <DocumentIcon v-else-if="icon === Icons.DOCUMENT" :size="size" />
  <PortIcon v-else-if="icon === Icons.PORT" :size="size" />
  <MaximizeIcon v-else-if="icon === Icons.MAXIMIZE" :size="size" />
  <MinimizeIcon v-else-if="icon === Icons.MINIMIZE" :size="size" />
  <ArrowLeft v-else-if="icon === Icons.ARROW_LEFT" :size="size" />
  <ListIcon v-else-if="icon === Icons.LIST" :size="size" />
  <FormatCheckListIcon v-else-if="icon === Icons.FORMAT_CHECK_LIST" :size="size" />
  <HelpCenterIcon v-else-if="icon === Icons.HELP_CENTER" :size="size" />
</template>

<script lang="ts" setup>
import LucideChartNoAxesCombinedIcon from '@/components/icon/LucideChartNoAxesCombinedIcon.vue';
import MessageSquareTextIcon from '@/components/icon/MessageSquareTextIcon.vue';
import SliderHorizontalIcon from '@/components/icon/SliderHorizontalIcon.vue';
import AccountMultipleIcon from '@/components/icon/AccountMultipleIcon.vue';
import MessageSquareIcon from '@/components/icon/MessageSquareIcon.vue';
import ChevronsLeftIcon from '@/components/icon/ChevronsLeftIcon.vue';
import ChatMessageIcon from '@/components/icon/ChatMessageIcon.vue';
import ChevronDownIcon from '@/components/icon/ChevronDownIcon.vue';
import CheckCheckIcon from '@/components/icon/CheckCheckIcon.vue';
import StatisticsIcon from '@/components/icon/StatisticsIcon.vue';
import MicrophoneIcon from '@/components/icon/MicrophoneIcon.vue';
import PhoneIncoming from '@/components/icon/PhoneIncoming.vue';
import MapMarkerIcon from '@/components/icon/MapMarkerIcon.vue';
import ClipboardIcon from '@/components/icon/ClipboardIcon.vue';
import PaperclipIcon from '@/components/icon/PaperclipIcon.vue';
import UserCheckIcon from '@/components/icon/UserCheckIcon.vue';
import ArrowLeftType from '@/components/icon/ArrowLeftType.vue';
import DownloadIcon from '@/components/icon/DownloadIcon.vue';
import ListTodoIcon from '@/components/icon/ListTodoIcon.vue';
import CalendarIcon from '@/components/icon/CalendarIcon.vue';
import ActivityIcon from '@/components/icon/ActivityIcon.vue';
import SettingsIcon from '@/components/icon/SettingsIcon.vue';
import AiStarsIcon from '@/components/icon/AiStarsIcon.vue';
import AccountIcon from '@/components/icon/AccountIcon.vue';
import SearchIcon from '@/components/icon/SearchIcon.vue';
import VideoIcon from '@/components/icon/VideoIcon.vue';
import UsersIcon from '@/components/icon/UsersIcon.vue';
import TasksIcon from '@/components/icon/TasksIcon.vue';
import PhoneIcon from '@/components/icon/PhoneIcon.vue';
import EmailIcon from '@/components/icon/EmailIcon.vue';
import TrashIcon from '@/components/icon/TrashIcon.vue';
import TruckIcon from '@/components/icon/TruckIcon.vue';
import CheckIcon from '@/components/icon/CheckIcon.vue';
import FrameIcon from '@/components/icon/FrameIcon.vue';
import LogoIcon from '@/components/icon/LogoIcon.vue';
import GridIcon from '@/components/icon/GridIcon.vue';
import MoonIcon from '@/components/icon/MoonIcon.vue';
import PlusIcon from '@/components/icon/PlusIcon.vue';
import MenuIcon from '@/components/icon/MenuIcon.vue';
import BellIcon from '@/components/icon/BellIcon.vue';
import TuneIcon from '@/components/icon/TuneIcon.vue';
import CheckAll from '@/components/icon/CheckAll.vue';
import EditIcon from '@/components/icon/EditIcon.vue';
import ViewIcon from '@/components/icon/ViewIcon.vue';
import SendIcon from '@/components/icon/SendIcon.vue';
import SunIcon from '@/components/icon/SunIcon.vue';
import PinIcon from '@/components/icon/PinIcon.vue';
import MapIcon from '@/components/icon/MapIcon.vue';
import DotsVertical from '@/components/icon/DotsVertical.vue';
import CopyIcon from '@/components/icon/CopyIcon.vue';
import MonitorIcon from '@/components/icon/MonitorIcon.vue';
import LinkIcon from '@/components/icon/LinkIcon.vue';
import CreditCardIcon from '@/components/icon/CreditCardIcon.vue';
import Building2Icon from '@/components/icon/Building2Icon.vue';
import PrinterIcon from '@/components/icon/PrinterIcon.vue';
import RepeatIcon from '@/components/icon/RepeatIcon.vue';
import HotSaleIcon from '@/components/icon/HotSaleIcon.vue';
import UserIcon from '@/components/icon/UserIcon.vue';
import AlertCircleIcon from '@/components/icon/AlertCircleIcon.vue';
import PlayIcon from '@/components/icon/PlayIcon.vue';
import PauseIcon from '@/components/icon/PauseIcon.vue';
import TranscriptionIcon from '@/components/icon/TranscriptionIcon.vue';
import XIcon from '@/components/icon/XIcon.vue';
import WarningIcon from '@/components/icon/WarningIcon.vue';
import CircleIcon from '@/components/icon/CircleIcon.vue';
import CircleDotIcon from '@/components/icon/CircleDotIcon.vue';
import RefreshCwIcon from '@/components/icon/RefreshCwIcon.vue';
import UsdIcon from '@/components/icon/UsdIcon.vue';
import LockIcon from '@/components/icon/LockIcon.vue';
import CarIcon from '@/components/icon/CarIcon.vue';
import UserFilledIcon from '@/components/icon/UserFilledIcon.vue';
import AITextIcon from '@/components/icon/AITextIcon.vue';
import CallIcon from '@/components/icon/CallIcon.vue';
import OutgoingCallIcon from '@/components/icon/OutgoingCallIcon.vue';
import IncomingCallIcon from '@/components/icon/IncomingCallIcon.vue';
import PhoneOffIcon from '@/components/icon/PhoneOffIcon.vue';
import CallMissedIcon from '@/components/icon/CallMissedIcon.vue';
import ShieldCheckIcon from '@/components/icon/ShieldCheckIcon.vue';
import ClockIcon from '@/components/icon/ClockIcon.vue';
import AIIcon from '@/components/icon/AIIcon.vue';
import InfoIcon from '@/components/icon/InfoIcon.vue';
import HelpCircleIcon from '@/components/icon/HelpCircleIcon.vue';
import UserPlusIcon from '@/components/icon/UserPlusIcon.vue';
import DollarSignIcon from '@/components/icon/DollarSignIcon.vue';
import InboxIcon from '@/components/icon/InboxIcon.vue';
import FolderIcon from '@/components/icon/FolderIcon.vue';
import BoxIcon from '@/components/icon/BoxIcon.vue';
import LogOutIcon from '@/components/icon/LogOutIcon.vue';
import ShieldCheckFull from '@/components/icon/ShieldCheckFull.vue';
import GoogleAuthenticationIcon from '@/components/icon/GoogleAuthenticationIcon.vue';
import TelegramIcon from '@/components/icon/TelegramIcon.vue';
import ChevronRightIcon from '@/components/icon/ChevronRightIcon.vue';
import UserXIcon from '@/components/icon/UserXIcon.vue';
import TruckOpenIcon from '@/components/icon/TruckOpenIcon.vue';
import ReloadIcon from '@/components/icon/ReloadIcon.vue';
import MoneyIcon from '@/components/icon/MoneyIcon.vue';
import OperatingExpensesIcon from '@/components/icon/OperatingExpensesIcon.vue';
import NetProfitIcon from '@/components/icon/NetProfitIcon.vue';
import CheckCircleIcon from '@/components/icon/CheckCircleIcon.vue';
import PhoneCallIcon from '@/components/icon/PhoneCallIcon.vue';
import ArrowUpRightIcon from '@/components/icon/ArrowUpRightIcon.vue';
import ArrowDownRightIcon from '@/components/icon/ArrowDownRightIcon.vue';
import RingingCall from '@/components/icon/RingingCall.vue';
import KeyboardIcon from '@/components/icon/KeyboardIcon.vue';
import MicrophoneOff from '@/components/icon/MicrophoneOff.vue';
import MinusIcon from '@/components/icon/MinusIcon.vue';
import PhoneOutgoing from '@/components/icon/PhoneOutgoing.vue';
import ArrowDownLeft from '@/components/icon/ArrowDownLeft.vue';
import SmsIcon from '@/components/icon/SmsIcon.vue';
import WhatsAppIcon from '@/components/icon/WhatsAppIcon.vue';
import ChevronsRightIcon from '@/components/icon/ChevronsRightIcon.vue';
import RobotIcon from '@/components/icon/RobotIcon.vue';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons-vue';
import ExternalLinkIcon from '@/components/icon/ExternalLinkIcon.vue';
import AiCallIcon from '@/components/icon/AiCallIcon.vue';
import DocumentIcon from '@/components/icon/DocumentIcon.vue';
import PortIcon from '@/components/icon/PortIcon.vue';
import MaximizeIcon from '@/components/icon/MaximizeIcon.vue';
import MinimizeIcon from '@/components/icon/MinimizeIcon.vue';
import ArrowLeft from '@/components/icon/ArrowLeft.vue';
import ListIcon from '@/components/icon/ListIcon.vue';
import FormatCheckListIcon from '@/components/icon/FormatCheckListIcon.vue';
import HelpCenterIcon from '@/components/icon/HelpCenterIcon.vue';
import { Icons } from './helpers';

interface IconProps {
  icon: Icons;
  size?: number | string;
}

withDefaults(defineProps<IconProps>(), {
  size: 16,
});
</script>
