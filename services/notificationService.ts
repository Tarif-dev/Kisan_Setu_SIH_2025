// Notification Service for push notifications and alerts

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

interface NotificationData {
  title: string;
  body: string;
  data?: any;
  categoryIdentifier?: string;
}

interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  trigger: Date | number;
  data?: any;
}

class NotificationService {
  constructor() {
    this.configurePushNotifications();
  }

  private async configurePushNotifications() {
    // Configure notification handling
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Set notification categories for interactive notifications
    await Notifications.setNotificationCategoryAsync("weather_alert", [
      {
        identifier: "view_details",
        buttonTitle: "View Details",
        options: {
          opensAppToForeground: true,
        },
      },
      {
        identifier: "dismiss",
        buttonTitle: "Dismiss",
        options: {
          isDestructive: true,
        },
      },
    ]);

    await Notifications.setNotificationCategoryAsync("farming_reminder", [
      {
        identifier: "mark_done",
        buttonTitle: "Mark Done",
        options: {
          opensAppToForeground: false,
        },
      },
      {
        identifier: "snooze",
        buttonTitle: "Remind Later",
        options: {
          opensAppToForeground: false,
        },
      },
    ]);
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Notification permissions not granted");
        return false;
      }

      // Get push token for remote notifications
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "AgriAssist Notifications",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#22C55E",
        });

        await Notifications.setNotificationChannelAsync("weather_alerts", {
          name: "Weather Alerts",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 500, 250, 500],
          lightColor: "#EF4444",
        });

        await Notifications.setNotificationChannelAsync("farming_reminders", {
          name: "Farming Reminders",
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#3B82F6",
        });
      }

      return true;
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return false;
    }
  }

  async sendImmediateNotification(
    notification: NotificationData
  ): Promise<string | null> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          categoryIdentifier: notification.categoryIdentifier,
        },
        trigger: null, // Send immediately
      });

      return identifier;
    } catch (error) {
      console.error("Error sending immediate notification:", error);
      return null;
    }
  }

  async scheduleNotification(
    notification: ScheduledNotification
  ): Promise<string | null> {
    try {
      // For demo purposes, just send immediate notification
      // In production, implement proper scheduling
      return await this.sendImmediateNotification({
        title: notification.title,
        body: notification.body,
        data: notification.data,
      });
    } catch (error) {
      console.error("Error scheduling notification:", error);
      return null;
    }
  }

  async cancelNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error("Error canceling notification:", error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error canceling all notifications:", error);
    }
  }

  // Farming-specific notification methods
  async sendWeatherAlert(alertData: {
    title: string;
    description: string;
    severity: "minor" | "moderate" | "severe" | "extreme";
  }): Promise<void> {
    const severityEmojis = {
      minor: "🌤️",
      moderate: "⚠️",
      severe: "⛈️",
      extreme: "🚨",
    };

    await this.sendImmediateNotification({
      title: `${severityEmojis[alertData.severity]} ${alertData.title}`,
      body: alertData.description,
      categoryIdentifier: "weather_alert",
      data: {
        type: "weather_alert",
        severity: alertData.severity,
      },
    });
  }

  async scheduleFarmingReminder(reminderData: {
    title: string;
    description: string;
    scheduledTime: Date;
    type: "irrigation" | "fertilizer" | "pesticide" | "harvest" | "general";
  }): Promise<string | null> {
    const typeEmojis = {
      irrigation: "💧",
      fertilizer: "🌱",
      pesticide: "🚜",
      harvest: "🌾",
      general: "🚜",
    };

    return await this.scheduleNotification({
      id: `farming_${Date.now()}`,
      title: `${typeEmojis[reminderData.type]} ${reminderData.title}`,
      body: reminderData.description,
      trigger: reminderData.scheduledTime,
      data: {
        type: "farming_reminder",
        category: reminderData.type,
      },
    });
  }

  async sendMarketPriceAlert(priceData: {
    cropName: string;
    currentPrice: number;
    change: number;
    changePercent: number;
  }): Promise<void> {
    const changeIcon = priceData.change >= 0 ? "📈" : "📉";
    const changeText = priceData.change >= 0 ? "increased" : "decreased";

    await this.sendImmediateNotification({
      title: `${changeIcon} ${priceData.cropName} Price Alert`,
      body: `Price has ${changeText} by ${Math.abs(priceData.changePercent).toFixed(1)}% to $${priceData.currentPrice.toFixed(2)}`,
      data: {
        type: "market_alert",
        crop: priceData.cropName,
        price: priceData.currentPrice,
        change: priceData.change,
      },
    });
  }

  async sendPestDetectionAlert(pestData: {
    pestName: string;
    confidence: number;
    severity: "low" | "medium" | "high";
  }): Promise<void> {
    const severityEmojis = {
      low: "🟢",
      medium: "🟡",
      high: "🔴",
    };

    await this.sendImmediateNotification({
      title: `${severityEmojis[pestData.severity]} Pest Detected: ${pestData.pestName}`,
      body: `Detected with ${pestData.confidence}% confidence. Check your crops and take appropriate action.`,
      data: {
        type: "pest_detection",
        pest: pestData.pestName,
        confidence: pestData.confidence,
        severity: pestData.severity,
      },
    });
  }

  // Daily farming tips
  async scheduleDailyTips(): Promise<void> {
    const tips = [
      "💡 Check soil moisture before watering to avoid overwatering your crops.",
      "🌱 Early morning is the best time for watering plants to reduce evaporation.",
      "🐛 Inspect your crops regularly for early pest detection and prevention.",
      "🌾 Proper crop rotation helps maintain soil health and prevents diseases.",
      "📊 Keep records of your farming activities for better decision making.",
      "🌡️ Monitor weather forecasts to plan your farming activities effectively.",
      "💧 Mulching helps retain soil moisture and suppress weeds naturally.",
    ];

    // Schedule a tip for tomorrow at 7 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(7, 0, 0, 0);

    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    await this.scheduleNotification({
      id: `daily_tip_${Date.now()}`,
      title: "Daily Farming Tip",
      body: randomTip,
      trigger: tomorrow,
      data: {
        type: "daily_tip",
      },
    });
  }

  // Get notification history
  async getScheduledNotifications(): Promise<any[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error getting scheduled notifications:", error);
      return [];
    }
  }
}

export const notificationService = new NotificationService();
