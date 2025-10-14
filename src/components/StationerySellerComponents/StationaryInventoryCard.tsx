import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { Colors } from "../../utils";
import { Entypo } from "@expo/vector-icons";
import Button from "../Button";
import RBSheet from "react-native-raw-bottom-sheet";
import MyTextInput from "../MyTextInput";

interface InventoryCardProps {
    productId: string;
    productName: string;
    category: string;
    stock: number;
    reorderLevel: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    onAddQuantity: (quantity: number) => void;
}

const StationaryInventoryCard = ({
    productId,
    productName,
    category,
    stock,
    reorderLevel,
    status,
    onAddQuantity
 
}: InventoryCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const addQuantityBottomSheetRef = useRef<any>(null);


  const [quantityToAdd, setQuantityToAdd] = useState("");
  const handleVehicleSubmit = (formData:any) => {
      console.log("Vehicle Data Submitted:", formData);
      // handle API call or state update here
      addQuantityBottomSheetRef.current?.close();
    };
    const handleEdit = (driver:any) => {
  
      addQuantityBottomSheetRef.current?.open(); // open bottom sheet
      // Navigate to form or open modal and pre-fill data
    };
  const getStatusColor = (status: string) => {
    switch (status) {
     
      case "In Stock":
        return "green";
      case "Low Stock":
        return Colors.Red;
      default:
        return Colors.Red;
    }
  };
  const handleAddQuantity = () => {
    const quantity = parseInt(quantityToAdd);
    if (!isNaN(quantity) && quantity > 0) {
      onAddQuantity(quantity);
      setQuantityToAdd("");
      addQuantityBottomSheetRef.current?.close();
    }
  };

  return (
    <>
    <TouchableOpacity
      onPress={() => setIsOpen(!isOpen)}
      style={styles.cardContainer}
    >
      <View style={{ flexDirection: "row" }}>
      
        <View style={{ width: '70%' }}>
          <Text numberOfLines={1} style={styles.cardTitle}>{productName}</Text>
          <Text style={styles.cardDescription}>Category: {category} </Text>
        </View>
        <View style={{ width: '30%', alignItems: 'flex-end' }}>
          <Text style={[styles.statusText, { color: getStatusColor(status) }]}>{status}</Text>
          <View style={{ alignItems: "flex-end", marginTop: 4 }}>
            <Entypo
              name={isOpen ? "chevron-small-up" : "chevron-small-down"}
              size={24}
              color="black"
            />
          </View>
        </View>
      </View>

      {isOpen && (
        <View style={{ marginTop: 10, borderTopWidth: 0.5, borderColor: Colors.lightBlue }}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Product ID</Text>
            <Text style={styles.detailRightText}>{productId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Product Name</Text>
            <Text style={styles.detailRightText}>{productName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Category</Text>
            <Text style={styles.detailRightText}>{category}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Stock Quantity</Text>
            <Text style={styles.detailRightText}>{stock}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLeftText}>Reorder Level</Text>
            <Text style={styles.detailRightText}>{reorderLevel}</Text>
          </View>
          
          <View style={[styles.detailRow,{justifyContent:'center'}]}>
                            <Button
                                label="Add Quantity"
                                onPress={() => {addQuantityBottomSheetRef.current.open()}}
                               
                            />
                           
                        </View>
        </View>
      )}
    </TouchableOpacity>
    <RBSheet
        ref={addQuantityBottomSheetRef}
        height={300}
        openDuration={250}
        customStyles={{
          container: styles.bottomSheetContainer,
        }}
      >
    {/* <Text style={styles.sheetTitle}>Add Buyer</Text> */}
    <MyTextInput
                  label="Add Quantity"
                  placeholder="Enter Quantity"
                  value={quantityToAdd}
                  onChange={setQuantityToAdd}
                />
   <View style={styles.footerContainer}>
              <Button label="Save" onPress={handleAddQuantity} />
           
            </View>
      </RBSheet>
    </>
  );
};

export default StationaryInventoryCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.SkyBlue,
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.black,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  detailRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLeftText: {
    fontSize: 14,
    color: Colors.black,
  },
  detailRightText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
  bottomSheetContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  footerContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
