import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { Colors, CurrencySign } from "../../utils";
import Button from "../Button";
import RBSheet from "react-native-raw-bottom-sheet";
interface Student {
    id: string;
    name: string;
    image: string;
    boarded: boolean;
    dropped: boolean;
  }
interface PickupPoint {
    name: string;
    address: string;
    pickupTime: string;
    dropTime: string;
    studentsCount?: number;
  }
  
  interface BookingCardProps {
    routeName: string;
    busNo: string;
    busModal: string;
    source?: string;
    destination?: string;
    pickupPoints?: PickupPoint[];
    totalStudents?: number;
  }

const CurrentRouteCard = (props: BookingCardProps) => {
    const {
      
        routeName,
        busNo,
        busModal,
        // authorization,
        source,
        destination,
        pickupPoints,
        totalStudents,
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const refRBSheet = useRef<any>(null);
    const [reachedPoints, setReachedPoints] = useState<boolean[]>(
        pickupPoints?.map(() => false) || []
      );
      
      const handleReached = (index: number) => {
        const updated = [...reachedPoints];
        updated[index] = true;
        setReachedPoints(updated);
        // console.log(`Reached: ${pickupPoints?.[index]?.name}`);
        // You can call your API here, e.g. markPickupPointReached(pickupPoints[index].id)
      };
      const [selectedPickupIndex, setSelectedPickupIndex] = useState<number | null>(null);
      const [pickupStudents, setPickupStudents] = useState<{ [key: number]: Student[] }>({});

useEffect(() => {
    if (pickupPoints) {
      const newStudentsData: { [key: number]: Student[] } = {};
      pickupPoints.forEach((point, index) => {
        const count = point.studentsCount || 0;
        const students: Student[] = Array.from({ length: count }, (_, i) => ({
          id: `${index}-${i}`,
          name: `Student ${i + 1}`,
          image: `https://i.pravatar.cc/150?img=${(index * 5 + i) % 70}`,
          boarded: false,
          dropped: false,
        }));
        newStudentsData[index] = students;
      });
      setPickupStudents(newStudentsData);
    }
  }, [pickupPoints]);
const openStudentList = (index: number) => {
    setSelectedPickupIndex(index);
    refRBSheet.current?.open();
  };
  const handleStudentMark = (studentIndex: number, type: 'boarded' | 'dropped') => {
    if (selectedPickupIndex === null) return;
    const updatedList = [...pickupStudents[selectedPickupIndex]];
    const student = updatedList[studentIndex];
  
    if (type === 'boarded') {
      student.boarded = true;
    } else if (type === 'dropped' && student.boarded) {
      student.dropped = true;
    }
  
    setPickupStudents(prev => ({ ...prev, [selectedPickupIndex]: updatedList }));
  };
    return (
        <>
        <TouchableOpacity
            onPress={() => setIsOpen(!isOpen)}
            style={styles.cardContainer}
        >
            <View style={{ flexDirection: "row" }}>
                <View style={{ width: '15%' }}>
                    <Image source={{ uri: `https://live.staticflickr.com/1265/5186579358_09025c5b3b_b.jpg` }} style={styles.profileImage} />
                </View>

                <View style={{ marginLeft: 10, width: '45%' }}>
                    <Text numberOfLines={1} style={styles.cardTitle}>
                        {busModal}
                    </Text>
                    <Text numberOfLines={1} style={styles.cardDescription}>
                        {routeName}
                    </Text>
                </View>

                <View style={{ width: '40%', alignItems: 'flex-end' }}>
                    <Text style={styles.statusText}>{busNo}</Text>
                    <View style={{ alignItems: "flex-end", marginTop: 4 }}>
                        {isOpen ? (
                            <Entypo name="chevron-small-up" size={24} color="black" />
                        ) : (
                            <Entypo name="chevron-small-down" size={24} color="black" />
                        )}
                    </View>
                </View>
            </View>

            {isOpen && (
                <View style={styles.detailSection}>
                   
                    {/* <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Authorization</Text>
                        <Text style={styles.detailValue}>{authorization}</Text>
                    </View> */}
                    {source && destination && (
                        <>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>From</Text>
                                <Text style={styles.detailValue}>{source}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>To</Text>
                                <Text style={styles.detailValue}>{destination}</Text>
                            </View>
                        </>
                    )}
                    {typeof totalStudents === 'number' && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Students</Text>
              <Text style={styles.detailValue}>{totalStudents}</Text>
            </View>
          )}
{pickupPoints && pickupPoints.length > 0 && (
  <View style={{ marginTop: 10 }}>
    <Text style={[styles.detailLabel, { marginBottom: 5 }]}>Pickup Points</Text>
    {pickupPoints.map((point, index) => (
      <View key={index} style={styles.pickupPointContainer}>
        <Text style={styles.pickupTitle}>{point.name}</Text>
        <Text style={styles.pickupDetail}>{point.address}</Text>
        <Text style={styles.pickupDetail}>Pickup: {point.pickupTime}</Text>
        <Text style={styles.pickupDetail}>Drop: {point.dropTime}</Text>
        {typeof point.studentsCount === 'number' && (
                    <Text style={styles.pickupDetail}>Students: {point.studentsCount}</Text>
                  )}
                  <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
<TouchableOpacity
  onPress={() => openStudentList(index)}
  style={styles.studentListBtn}
>
  <Text style={styles.reachedBtnText}>📋 Student List</Text>
</TouchableOpacity>
<TouchableOpacity
      onPress={() => handleReached(index)}
      style={[
        styles.reachedBtn,
        reachedPoints[index] && styles.reachedBtnDisabled
      ]}
      disabled={reachedPoints[index]}
    >
      <Text style={styles.reachedBtnText}>
        {reachedPoints[index] ? 'Reached ✅' : 'Mark as Reached'}
      </Text>
    </TouchableOpacity>
    </View>
      </View>
    ))}
  </View>
)}
                
                </View>
            )}
        </TouchableOpacity>
        <RBSheet
        ref={refRBSheet}
        height={400}
        openDuration={250}
        customStyles={{ container: { padding: 20 } }}
      >
        <Text style={styles.sheetTitle}>Students</Text>
        <FlatList
        showsVerticalScrollIndicator={false}
          data={pickupStudents[selectedPickupIndex ?? 0] || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
//             <View style={styles.studentItem}>
//               <Image source={{ uri: item.image }} style={styles.studentImage} />
//               <Text  numberOfLines={1}
//       ellipsizeMode="tail" style={styles.studentName}>{item.name} djhf jhdf jskhfdj s k</Text>
//               <View style={{  flexDirection: 'row', gap: 8 }}>
//     <Button
//       label={item.boarded ? "Boarded ✅" : "Mark as Boarded"}
//       disabled={item.boarded || item.dropped}
//       onPress={() => handleStudentMark(index, 'boarded')}
//       style={{ padding: 10,marginTop:5 }}
//       textStyle={{fontSize:12}}
//     />

//     <Button
//       label={item.dropped ? "Dropped ✅" : "Mark as Dropped"}
//       disabled={!item.boarded || item.dropped}
//       onPress={() => handleStudentMark(index, 'dropped')}
//       style={{ padding: 10,marginTop:5 }}
//       textStyle={{fontSize:12}}
//     />
//   </View>
//             </View>
<View style={styles.studentItem}>
  <Image source={{ uri: item.image }} style={styles.studentImage} />

  <View style={{ flex: 1, flexDirection: 'column',  }}>
    <Text
      style={styles.studentName}
     
    >
      {item.name} 
    </Text>

    <View style={{ flexDirection: 'row',  justifyContent:'space-between' }}>
      <Button
        label={item.boarded ? "Boarded ✅" : "Mark as Boarded"}
        disabled={item.boarded || item.dropped}
        onPress={() => handleStudentMark(index, 'boarded')}
        style={{ padding: 10,marginTop:5 }}
               textStyle={{fontSize:12}}
      />
      <Button
        label={item.dropped ? "Dropped ✅" : "Mark as Dropped"}
        disabled={!item.boarded || item.dropped}
        onPress={() => handleStudentMark(index, 'dropped')}
        style={{ padding: 10,marginTop:5 }}
               textStyle={{fontSize:12}}
      />
    </View>
  </View>
</View>

          )}
        />
      </RBSheet>

</>
    );
};

export default CurrentRouteCard;

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
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    cardTitle: {
        fontSize: 14,
        color: Colors.black,
    },
    cardDescription: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: "bold",
    },
    statusText: {
        color: Colors.black,
        fontSize: 12,
    },
    detailSection: {
        marginTop: 10,
        borderTopWidth: 0.5,
        borderColor: Colors.lightBlue,
    },
    detailRow: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    detailLabel: {
        fontSize: 14,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: "bold",
    },
    editBtn: {
        width: '48%',
        backgroundColor: Colors.secondary,
    },
    deleteBtn: {
        width: '48%',
    },
    pickupPointContainer: {
        backgroundColor: Colors.white,
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
        borderWidth: 0.5,
        borderColor: Colors.lightBlue,
      },
      pickupTitle: {
        fontWeight: 'bold',
        fontSize: 13,
        color: Colors.black,
        marginBottom: 4,
      },
      pickupDetail: {
        fontSize: 12,
        color: Colors.black,
        marginTop:5
      },
      reachedBtn: {
        marginTop: 10,
        backgroundColor: Colors.primary,
        paddingVertical: 8,
        paddingHorizontal:5,
        borderRadius: 6,
        alignItems: 'center',
      },
      reachedBtnDisabled: {
        backgroundColor: Colors.lightBlue,
      },
      reachedBtnText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: 'bold',
      },
      studentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
      },
      studentImg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
      },
    
      studentListBtn: {
        marginTop: 8,
        backgroundColor: Colors.primary,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        alignItems: 'center',
      },
      sheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      studentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap:8,
      },
      studentImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
      },
      studentName: {
        fontSize: 14,
        color: Colors.black,
      flex:1,
      fontWeight:'bold'
      },
});
