# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions
import json
from typing import List, Dict, Text, Any

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []

class ActionDisplayOpeningHours(Action):

    def name(self) -> Text:
        return "action_display_opening_hours"

    async def run(self, dispatcher: "CollectingDispatcher", tracker: Tracker, domain: "DomainDict") -> List[
        Dict[Text, Any]]:
        dispatcher.utter_message(text="Certainly! Here are the opening hours:")
        with open('opening_hours.json') as f:
            contents = json.load(f)
            day = tracker.get_slot("day")
            if not day:
                for item in contents['items']:
                    if contents['items'][item]['open'] == 0 and contents['items'][item]['close'] == 0:
                        text = str(item) + ": closed"
                    else:
                        text = str(item) + ": " + str(contents['items'][item]['open']) + " - " + str(
                            contents['items'][item]['close'])
                    dispatcher.utter_message(text=text)
            else:
                for item in contents['items']:
                    if str(item).lower() == str(day).lower():
                        if contents['items'][item]['open'] == 0 and contents['items'][item]['close'] == 0:
                            text = str(item) + ": closed"
                        else:
                            text = str(item) + ": " + str(contents['items'][item]['open']) + " - " + str(
                                contents['items'][item]['close'])
                        dispatcher.utter_message(text=text)
                        break
            return []


class DisplayMenuAction(Action):

    def name(self) -> Text:
        return "action_display_menu"

    async def run(self, dispatcher: "CollectingDispatcher", tracker: Tracker, domain: "DomainDict") -> List[
        Dict[Text, Any]]:
        dispatcher.utter_message(text="Sure! Here is our current menu:")
        with open('menu.json') as f:
            contents = json.load(f)
            for item in contents['items']:
                text = str(item['name']) + ": " + str(item['price']) + " PLN"
                dispatcher.utter_message(text=text)
        return []


class OrderFoodAction(Action):

    def name(self) -> Text:
        return "action_order_food"

    async def run(self, dispatcher: "CollectingDispatcher", tracker: Tracker, domain: "DomainDict") -> List[
        Dict[Text, Any]]:
        with open('menu.json') as f:
            contents = json.load(f)
            meal_choice = tracker.get_slot("meal")
            extras = tracker.get_slot("extras")
            exclusions = tracker.get_slot("exclusions")
            if not meal_choice:
                dispatcher.utter_message(text="You haven't ordered anything, would you like to order again?")
                return []
            for meal in contents['items']:
                if str(meal['name']).lower() == meal_choice.lower():
                    text = "Registered " + str(meal_choice)
                    if not extras:
                        dispatcher.utter_message("No extras registered")
                    else:
                        text += ", extra " + str(extras)
                    if not exclusions:
                        dispatcher.utter_message("No exclusions registered")
                    else:
                        text += ", no " + str(exclusions)
                    dispatcher.utter_message(text=text)
                    return []
            dispatcher.utter_message(text="I'm sorry, I couldn't find " + str(meal_choice) + "in the menu. Would you "
                                                                                             "like to order again?")
            return []
