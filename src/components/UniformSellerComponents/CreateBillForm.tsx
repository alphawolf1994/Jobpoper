import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";

import { Colors, CurrencySign } from "../../utils";
import { Button, MyTextInput, ErrorText, HeadingText } from "../../components";
import DropDownPicker from "react-native-dropdown-picker";
import MyTextArea from "../MyTextArea";
import { Feather } from "@expo/vector-icons";

type AddDriverFormProps = {
  onSubmit: () => void;
};

const CreateBillForm: React.FC<AddDriverFormProps> = ({ onSubmit }) => {
  const [stepNumber, setStepNumber] = useState(1);
  const [openProduct, setOpenProduct] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [productName, setProductName] = useState('');
  const [schoolContact, setSchoolContact] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [productListState, setProductListState] = useState([
    { value: '', price: 0, quantity: 1 }
  ]);
  const [openProductIndex, setOpenProductIndex] = useState<number | null>(null);
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  

  // Convert for dropdown items
  const updateProductField = (index: number, updatedFields: Partial<typeof productListState[0]>) => {
    const updated = [...productListState];
    updated[index] = { ...updated[index], ...updatedFields };
    setProductListState(updated);
  };
  
  const changeQuantity = (index: number, delta: number) => {
    const updated = [...productListState];
    let newQuantity = updated[index].quantity + delta;
    if (newQuantity < 1) newQuantity = 1;
    updated[index].quantity = newQuantity;
    setProductListState(updated);
  };
  
  const addNewProductBlock = () => {
    setProductListState(prev => [...prev, { value: '', price: 0, quantity: 1 }]);
  };
  

 
  const secondStep = () => {
    if (validateStepOne()) {
        setStepNumber(2);
    }
};
const backToFirstStep = () => {
  setStepNumber(1);
};
const thirdStep = () => {

      setStepNumber(3);
  
};
  const validateStepOne = () => {
    let tempErrors: { [key: string]: string } = {};
  
    if (!schoolName.trim()) tempErrors.schoolName = "School name is required";
    if (!contactPerson.trim()) tempErrors.contactPerson = "Contact person name are required";
    if (!schoolContact.trim()) tempErrors.schoolContact = "Contact number is required";
  
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  

  const submitData = () => {
    if (validateStepOne()) {
      onSubmit();
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
      
        {stepNumber == 1 && <View>
          <View style={styles.headerContainer}>
      <HeadingText text="Buyer Details" />
       
      </View>
        <MyTextInput
          label="School Name"
          value={schoolName}
          error={errors.schoolName}
          placeholder="Enter school name"
          onChange={setSchoolName}
        />
        <MyTextInput
          label="Contact Person Name"
          value={contactPerson}
          error={errors.contactPerson}
          placeholder="Enter contact person"
          onChange={setContactPerson}
        />
        <MyTextInput
          label="Contact No"
          value={schoolContact}
          error={errors.schoolContact}
          placeholder="Enter contact No"
          keyboardType="numeric"
          onChange={setSchoolContact}
        />
          <View style={styles.footerContainer}>
                        <Button label="Next" onPress={() => { secondStep() }} style={{ width: '100%' }} />
                    </View>
</View>}
{stepNumber == 2 && (
  <View>
     <View style={styles.headerContainer}>
      <HeadingText text="Product Details" />
        <TouchableOpacity
        style={styles.paidFeeContainer}
        onPress={addNewProductBlock}
      >
        <Feather name="plus-circle" size={24} color="white" />
        <Text style={[styles.feeText]}>
          Add  More
        </Text>
      </TouchableOpacity>
      </View>
    {productListState.map((product, index) => (
      <View key={index} style={{ marginBottom: 20,zIndex: 1000 + index }}>
         <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
<MyTextInput
          label="Product Name"
          value={String(product.value)}
          placeholder="Enter product"
          onChange={val => updateProductField(index, { value: val  })}
          firstContainerStyle={{width:'45%'}}
        />
         <MyTextInput
          label="Price"
          value={String(product.price)}
          placeholder="Enter price"
          keyboardType="numeric"
          onChange={val => updateProductField(index, { price: parseInt(val) || 0 })}
          firstContainerStyle={{width:'45%'}}
        />
        </View>
 <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
       
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
          <Button label="−" onPress={() => changeQuantity(index, -1)}  style={{marginTop:0,borderRadius:5,padding:10}}/>
          <Text style={{ marginHorizontal: 10 }}>{product.quantity}</Text>
          <Button label="+" onPress={() => changeQuantity(index, 1)} style={{marginTop:0,borderRadius:5,padding:10}}/>
        </View>

        <Text>Total: {CurrencySign} {product.price * product.quantity}</Text>
        </View>
      </View>
    ))}

<View style={styles.footerContainer}>
                        <Button label="Back" onPress={() => { backToFirstStep() }} style={styles.backBtn} />
                        <Button label="Next" onPress={() => { thirdStep() }} style={styles.nextBtn} />
                    </View>
   
  </View>
)}
{stepNumber == 3 && (
  <View>
    <View style={styles.headerContainer}>
      <HeadingText text="Checkout Summary" />
    </View>

    {productListState.map((product, index) => (
      <View key={index} style={styles.summaryItem}>
        <Text style={styles.productName}>{product.value || `Product ${index + 1}`}</Text>
        <Text>Price: {CurrencySign} {product.price}</Text>
        <Text>Quantity: {product.quantity}</Text>
        <Text>Total: {CurrencySign} {product.price * product.quantity}</Text>
      </View>
    ))}

    <View style={styles.divider} />

    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>Subtotal:</Text>
      <Text style={styles.totalValue}>
        {CurrencySign} {productListState.reduce((acc, item) => acc + item.price * item.quantity, 0)}
      </Text>
    </View>

    <MyTextInput
      label="Discount Amount"
      value={String(discount)}
      placeholder="Enter discount"
      keyboardType="numeric"
      onChange={(val) => setDiscount(Number(val) || 0)}
    />

    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>Grand Total:</Text>
      <Text style={styles.totalValue}>
        {CurrencySign} {(productListState.reduce((acc, item) => acc + item.price * item.quantity, 0) - discount)}
      </Text>
    </View>

    <View style={styles.footerContainer}>
      <Button label="Back" onPress={backToFirstStep} style={styles.backBtn} />
      <Button label="Submit" onPress={submitData} style={styles.nextBtn} />
    </View>
  </View>
)}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: 'row'
  },
  dropdown: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  dropdownContainer: {
    position: "absolute",
    top: 50,
    zIndex: 1000,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 20,
    color: Colors.black,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
 
    marginVertical:10,
   
  },
  paidFeeContainer:{
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:Colors.primary,
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:10
  },
 
  feeText:{
    marginLeft: 8,
    fontSize: 16, 
    fontWeight:'bold',
    color:Colors.white
  },
  backBtn: {
    width: '45%',
    backgroundColor: Colors.gray
},
nextBtn: {
    width: '45%',
    // backgroundColor:Colors.gray
},
summaryItem: {
  padding: 10,
  borderWidth: 1,
  borderColor: Colors.gray,
  borderRadius: 10,
  marginBottom: 10,
},
productName: {
  fontWeight: 'bold',
  fontSize: 16,
  marginBottom: 4,
},
divider: {
  borderBottomWidth: 1,
  borderBottomColor: Colors.gray,
  marginVertical: 10,
},
totalRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginVertical: 5,
},
totalLabel: {
  fontWeight: 'bold',
  fontSize: 16,
},
totalValue: {
  fontSize: 16,
},

});

export default CreateBillForm;
