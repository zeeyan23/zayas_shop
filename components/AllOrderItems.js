import { StyleSheet, View } from "react-native";

function AllOrderItems(){
    return(
        <>
            <View style={styles.container}>
                <Text>Orders Will be shown here</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})

export default AllOrderItems;