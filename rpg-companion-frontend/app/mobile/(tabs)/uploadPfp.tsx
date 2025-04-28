import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import SessionStorage from 'react-native-session-storage';



export default function UploadPfp() {
  const characterUid = SessionStorage.getItem('characterUid');
  const userUid = SessionStorage.getItem("userUid");
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
      base64: true,
    });

    // console.log(result);
    if (!result.canceled) {
      const image = result.assets[0].base64
      const uri = result.assets[0].uri
      const imageType = result.assets[0].type + "/" + uri.split('.').pop();
      const response = await fetch(uri); // Fetch the file data
      const imageBlob = await response.blob(); // Convert the file to a binary blob
      console.log(imageType);
      uploadImage(imageBlob, imageType);
    }
  };


  const uploadImage = async (image, content_type) => {
    //   file = await compressImage(file, 100)

      if(!image){
          console.log("No File Selected")
          return
      }

      fetch("https://fmesof4kvl.execute-api.us-east-2.amazonaws.com/save-image", {
          method: "POST",
          headers: {
              "user_uid" : userUid,
              "character_uid" : characterUid,
              "session_token" : "cooper_is_slow",
              "content-type" : content_type
          },
          body: image
      })
      .then(response => response.json())
      .then(data => console.log(data))
  }

//   const compressImage = async (file, targetSizeKB) => {
//     const imageBitmap = await createImageBitmap(file);
//     const canvas = document.createElement("canvas");
//     canvas.width = imageBitmap.width;
//     canvas.height = imageBitmap.height;
//     console.log("Image Width: " + imageBitmap.width)
//     console.log("Image Height: " + imageBitmap.height)
//     const context = canvas.getContext("2d");
//     context.drawImage(imageBitmap, 0, 0)

//     let quality = 0.95;
//     let compressedImage = await new Promise((resolve) =>
//         canvas.toBlob(resolve, file.type, 1)
//     );

//     console.log("Target Size: " + targetSizeKB * 1024)
//     let high = 1, low = 0
//     while(low <= high) {
//         let midpointQuality = (high + low) / 2.0;
//         //console.log("New Mid: " + midpointQuality)
//         let compressedImage = await new Promise((resolve) =>
//             canvas.toBlob(resolve, file.type, midpointQuality)
//         );
//         let imageSizeRatio = compressedImage.size / (targetSizeKB * 1024)

//        // console.log("ImageSizeRatio: " + imageSizeRatio)
//         // Massive files 
//         if (imageSizeRatio > 6) {
//             imageSizeRatio = 6
//         }
         
//         //Image is too big
//         if(imageSizeRatio > 1) {
//             high = midpointQuality * (1 - 0.1 * (imageSizeRatio - 1)); //Some percentage
//         }
//         //Image is too small
//         else {
//             low = midpointQuality * (1 + 0.1 * (1 - imageSizeRatio));//some percentage
//         }

//         //Recall compress with a smaller image if it's too big
//         if(midpointQuality < 0.0000000001) {
//             console.log("Recursive Call")
//             return await compressImage(
//                 new File([compressedImage], file.name, {
//                     type: file.type,
//                     lastModified: new Date().getTime()
//                 }), targetSizeKB);
//         }
        
//     }

//     return new File([compressedImage], file.name, {
//         type: file.type,
//         lastModified: new Date().getTime()
//     })
// }



  return (
    <View style={styles.container}>
      <Button onPress={pickImage} title="Pick Image" color="coral" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  pic: {
    height: 200,
    width: 200,
  }
});