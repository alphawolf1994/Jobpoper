import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
} from "react-native";

import { Colors,  } from "../../utils";
import { Header, Button, MyTextInput, ErrorText } from "../../components";
import { Controller, useForm } from "react-hook-form";
type DriverFormData = {
    productName: string;
    category: string;
    stock: string;
    price: string;


};

type AddDriverFormProps = {
    onSubmit: (data: DriverFormData) => void;

};

const AddStationaryProductForm: React.FC<AddDriverFormProps> = ({ onSubmit }) => {


    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<DriverFormData>({

    });





    return (

        <ScrollView showsVerticalScrollIndicator={false}>
            {/* Pass the form as a child */}

            <View>
                <Controller
                    name="productName"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "Product name is required",
                        },

                    }}
                    render={({ field: { onChange, value } }) => (
                        <MyTextInput
                            label="Product Name"
                            placeholder="Enter product name"
                            value={value}
                            error={errors.productName?.message}
                            onChange={onChange}
                        />
                    )}
                />

                <Controller
                    name="category"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "Category is required",
                        },

                    }}
                    render={({ field: { onChange, value } }) => (
                        <MyTextInput
                            label="Category"
                            value={value}
                            error={errors.category?.message}
                            placeholder="Enter category"
                            onChange={onChange}
                        />
                    )}
                />

                <Controller
                    name="stock"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "Stock is required",
                        },

                    }}
                    render={({ field: { onChange, value } }) => (
                        <MyTextInput
                            label="Stock"
                            value={value}
                            error={errors.stock?.message}
                            placeholder="Enter stock"
                            onChange={onChange}
                            keyboardType="numeric"
                        />
                    )}
                />
                <Controller
                    name="price"
                    control={control}
                    rules={{
                        required: {
                            value: true,
                            message: "Price is required",
                        },

                    }}
                    render={({ field: { onChange, value } }) => (
                        <MyTextInput
                            label="Unit Price"
                            value={value}
                            error={errors.price?.message}
                            placeholder="Enter price"
                            onChange={onChange}
                            keyboardType="numeric"
                        />
                    )}
                />


                <View style={styles.footerContainer}>
                    <Button label="Submit" onPress={handleSubmit(onSubmit)} />

                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    footerContainer: {
        flex: 1,
        justifyContent: "center",
    },



});

export default AddStationaryProductForm;
