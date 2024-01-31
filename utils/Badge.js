import { Text, View } from "react-native";

function Badge({ count }){
    return (
        <View
          style={{
            position: 'absolute',
            bottom: 50,
            right: 10,
            backgroundColor: 'red',
            borderRadius:10,
            paddingHorizontal:7,
            paddingVertical:3,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex:1
          }}
        >
          <Text style={{ color: 'white', fontSize: 12 }}>{count}</Text>
        </View>
      );
}

export default Badge;