from rest_framework import serializers
from .models import Student, Subject, AttendanceRecord, User

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

date = serializers.DateField(
        format="%d-%m-%Y", 
        input_formats=["%Y-%m-%d", "%d-%m-%Y"]
    )
time = serializers.TimeField(
        format="%I:%M %p", 
        input_formats=["%H:%M", "%I:%M %p"]
    )

class Meta:
    model = AttendanceRecord
    fields = "__all__"

# class AttendanceSerializer(serializers.ModelSerializer):
#     faculty = UserSerializer(read_only=True)   # show faculty object instead of id
#     subject = SubjectSerializer(read_only=True)  # show subject object instead of id
#     students = StudentSerializer(many=True, read_only=True)  # show student objects instead of ids

#     class Meta:
#         model = AttendanceRecord
#         fields = '__all__'

        
# class AttendanceRequestSerializer(serializers.Serializer):
#     username = serializers.CharField()
#     subjectId = serializers.IntegerField()
#     date = serializers.CharField()
#     time = serializers.CharField()
#     students = serializers.ListField(
#         child=serializers.DictField()
#     )

#     def create(self, validated_data):
#         # get faculty (User)
#         faculty = User.objects.get(username=validated_data["username"])

#         # get subject
#         subject = Subject.objects.get(id=validated_data["subjectId"])

#         # create attendance record (without student!)
#         record = AttendanceRecord.objects.create(
#             faculty=faculty,
#             subject=subject,
#             date=validated_data["date"],
#             time=validated_data["time"],
#             number_of_students=len(validated_data["students"])
#         )

#         # add students to ManyToMany
#         for stu in validated_data["students"]:
#             student = Student.objects.get(id=stu["id"])
#             record.students.add(student)

#         return record        


class AttendanceReadSerializer(serializers.ModelSerializer):
    faculty = UserSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    students = StudentSerializer(many=True, read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = ("id", "faculty", "subject", "students",
                  "number_of_students", "date", "time")

class AttendanceWriteSerializer(serializers.ModelSerializer):
    # incoming payload: faculty=<username>, subject=<id>, students=[ids]
    faculty = serializers.CharField(write_only=True)
    subject = serializers.IntegerField(write_only=True)
    students = serializers.ListField(child=serializers.IntegerField(), write_only=True)

    class Meta:
        model = AttendanceRecord
        fields = ("faculty", "subject", "students", "number_of_students", "date", "time")

    def create(self, validated_data):
        username = validated_data.pop("faculty")
        subject_id = validated_data.pop("subject")
        student_ids = validated_data.pop("students")

        try:
            faculty_obj = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError({"faculty": "Faculty username not found"})

        try:
            subject_obj = Subject.objects.get(id=subject_id)
        except Subject.DoesNotExist:
            raise serializers.ValidationError({"subject": "Subject id not found"})

        att = AttendanceRecord.objects.create(
            faculty=faculty_obj,
            subject=subject_obj,
            number_of_students=validated_data.get("number_of_students", 0),
            date=validated_data["date"],
            time=validated_data["time"],
        )
        qs_students = Student.objects.filter(id__in=student_ids)
        att.students.set(qs_students)
        att.number_of_students = qs_students.count()
        att.save()
        return att
