import SessionStorage from "react-native-session-storage";



export const storeCharacterFromUID = async () => {
    try {

        console.log("start of storeCharacterFromUID");
        console.log("user_uid: "+SessionStorage.getItem("userUID"));
        console.log("character_uid:" + SessionStorage.getItem("selectedCharacter"));

        const response = await fetch(
          "https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/get-character",
          {
            method: "POST",
            body: JSON.stringify({
              user_uid: SessionStorage.getItem("userUID"),
              character_uid: SessionStorage.getItem("selectedCharacter"),
            }),
          }
        );
  
        if (!response.ok) {
          console.log("!response.ok");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const character = await response.json();
        SessionStorage.setItem("selectedCharacterData", character);
        console.log("Character Recieved", character);
    }
    catch (error) {
        console.log("Could not recieve character: ", error);
    }
};
