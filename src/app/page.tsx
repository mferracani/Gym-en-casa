import { TodayScreen } from "@/components/home/today-screen";
import {
  navigationItems,
  todayPlan,
  weekPlan,
} from "@/data/training-plan";

export default function Home() {
  return (
    <TodayScreen
      navigation={navigationItems}
      plan={todayPlan}
      week={weekPlan}
    />
  );
}
