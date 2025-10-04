from turtle import update
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.status import *
from .models import Student, Subject, AttendanceRecord, User
# from .serializers import AttendanceRequestSerializer, StudentSerializer, SubjectSerializer, AttendanceSerializer, UserSerializer

''' ------  register_user------- '''

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"success": True, "message": "User registered."}, status=HTTP_201_CREATED)
    return Response({"success": False, "errors": serializer.errors}, status=HTTP_400_BAD_REQUEST)

''' ------  login_user-------'''

@api_view(['POST'])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    try:
        user = User.objects.get(username=username, password=password)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response(False)

#list_admins
@api_view(['GET'])
def list_admins(request):
    admins = User.objects.filter(role='admin')
    serializer = UserSerializer(admins, many=True)
    return Response(serializer.data)

#list_faculty
@api_view(['GET'])
def list_faculty(request):
    faculty = User.objects.filter(role='faculty')
    serializer = UserSerializer(faculty, many=True)
    return Response(serializer.data)

# @api_view(['PUT'])
# def update_user(request, username):
#     try:
#         user = User.objects.get(username=username)
#         serializer = UserSerializer(user, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(True)
#         return Response(False)
#     except User.DoesNotExist:
#         return Response(False)

# @api_view(['DELETE'])
# def delete_user(request, username):
#     try:
#         user = User.objects.get(username=username)
#         user.delete()
#         return Response(True)
#     except User.DoesNotExist:
#         return Response(False)


# ---------- SUBJECT ----------

@api_view(['GET','POST'])
def add_subject(request):
    if request.method == 'GET':
        subjects = Subject.objects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data, status=HTTP_200_OK)
    elif request.method == 'POST':
        serializer = SubjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "message": "Subject added."}, status=HTTP_201_CREATED)
        return Response({"success": False, "error": "Something wrong..."}, status=HTTP_400_BAD_REQUEST)


@api_view(['GET','PUT','DELETE'])
def list_subjects(request, id):
    try:
        subject = Subject.objects.get(id=id)
    except:
        return Response({"success": False, "error": "Subject Not found"}, status=HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = SubjectSerializer(subject)
        return Response(serializer.data, status=HTTP_200_OK)
    elif request.method == 'PUT':
        serializer = SubjectSerializer(subject, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "message": "Subject updated."}, status=HTTP_200_OK)
        return Response({"success": False, "error": "Something wrong..."}, status=HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        subject.delete()
        return Response({"success": True, "message": "Subject deleted."}, status=HTTP_204_NO_CONTENT)


#     #     subject = Subject.objects.get(id=id)
#     #     serializer = SubjectSerializer(subject)
#     #     return Response(serializer.data)
#     # except Subject.DoesNotExist:
#     #     return Response(False)

# @api_view(['DELETE'])
# def delete_subject(request, id):
#     try:
#         subject = Subject.objects.get(id=id)
#         subject.delete()
#         return Response(True)
#     except Subject.DoesNotExist:
#         return Response(False)

# @api_view(['PUT'])
# def update_subject(request):
#     try:
#         subject = Subject.objects.get(id=request.data.get("id"))
#         serializer = SubjectSerializer(subject, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(True)
#         return Response(False)
#     except Subject.DoesNotExist:
#         return Response(False)

# @api_view(['GET'])
# def list_subjects(request):
#     subjects = Subject.objects.all()
#     serializer = SubjectSerializer(subjects, many=True)
#     return Response(serializer.data)


# ---------- STUDENT ----------
@api_view(['GET','POST'])
def add_students(request):
    if request.method == 'GET':
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data, status=HTTP_200_OK)
    elif request.method == 'POST':
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "message": "Student added."}, status=HTTP_201_CREATED)
        return Response({"success": False, "error": "Something wrong..."}, status=HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def detail_student(request, id):
    try:
        student = Student.objects.get(id=id)
    except Student.DoesNotExist:
        return Response({"success": False, "error": "Student Not found"}, status=HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = StudentSerializer(student)
        return Response(serializer.data, status=HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = StudentSerializer(student, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=HTTP_200_OK)
        return Response(serializer.error,status=HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        student.delete()
        return Response({"success": True, "message": "Student deleted."}, status=HTTP_204_NO_CONTENT)

'''---------- USER ----------'''

@api_view(['GET'])
def all_user(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=HTTP_200_OK)
    return Response({"success": False, "error": "Something wrong..."}, status=HTTP_400_BAD_REQUEST)
    
@api_view(['GET','PUT','DELETE'])
def single_user(request, username):
    try:
        user = User.objects.get(username=username)
    except:
        return Response({"success": False, "error": "User Not found"}, status=HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data, status=HTTP_200_OK)
    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "message": "User updated."}, status=HTTP_200_OK)
        return Response({"success": False, "error": "Something wrong..."}, status=HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        user.delete()
        return Response({"success": True, "message": "User deleted."}, status=HTTP_204_NO_CONTENT)
    

@api_view(['GET'])
def profiles(request,username):
    try:
        user = User.objects.get(username=username)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response(False)
    
@api_view(['POST'])
def updata_profile(request, username):
    user = User.objects.get(username=username)
    if request.method == 'POST':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "message": "User updated."}, status=HTTP_200_OK)
        return Response({"success": False, "error": "Something wrong..."}, status=HTTP_400_BAD_REQUEST)
    
    

    # serializer = UserSerializer(data=request.data)
    # if serializer.is_valid():
    #     serializer.save()
    #     return Response({"success": True}, status=status.HTTP_201_CREATED)
    # return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['GET'])
# def list_users(request):
#     users = User.objects.all()
#     serializer = UserSerializer(users, many=True)
#     return Response(serializer.data)



# @api_view(['PUT'])
# def update_user(request,username):
#     try:
#         user = User.objects.get(username=username)
#         serializer = UserSerializer(user, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(True)
#         return Response(False)
#     except User.DoesNotExist:
#         return Response(False)



# ---------- ATTENDANCE ----------
@api_view(['GET','POST'])

def add_attendance(request):
    if request.method == 'GET':
        attendance = AttendanceRecord.objects.all()
        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data, status=HTTP_200_OK)
    elif request.method == 'POST':
        serializer = AttendanceSerializer(data=request.data)
        if serializer.is_valid():
            record = serializer.save()
            # return Response(serializer.data,{'attendance_id': record.id} status=HTTP_201_CREATED)
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def date_subject(request, date, subject_id):
    """
    Get attendance records filtered by date and subject_id.
    """
    attendance = AttendanceRecord.objects.filter(date=date, subject_id=subject_id)
    serializer = AttendanceSerializer(attendance, many=True)
    return Response(serializer.data, status=HTTP_200_OK)

@api_view(['GET'])
def faculty(request, id):
    """
    Get attendance records filtered by faculty_id.
    """
    attendance = AttendanceRecord.objects.filter(id=id)
    serializer = AttendanceSerializer(attendance, many=True)
    return Response(serializer.data, status=HTTP_200_OK)

@api_view(['GET'])
def faculty_subject_date(request, id, subject_id, date):
    """
    Get attendance records filtered by faculty_id, subject_id, and date.
    """
    attendance = AttendanceRecord.objects.filter(id=id, subject_id=subject_id, date=date)
    serializer = AttendanceSerializer(attendance, many=True)
    return Response(serializer.data, status=HTTP_200_OK)

#     # Unified function to get attendance by various filters
# @api_view(['GET'])
# def detail_attendance(request):
#     """
#     Get attendance records filtered by optional faculty_id, subject_id, and date.
#     Pass as query params: ?faculty_id=...&subject_id=...&date=...
#     """
#     filters = {}
#     faculty_id = request.GET.get('faculty_id')
#     subject_id = request.GET.get('subject_id')
#     date = request.GET.get('date')

#     if faculty_id:
#         filters['faculty__id'] = faculty_id
#     if subject_id:
#         filters['subject_id'] = subject_id
#     if date:
#         filters['date'] = date

#     attendance = AttendanceRecord.objects.filter(**filters)
#     serializer = AttendanceSerializer(attendance, many=True)
#     return Response(serializer.data, status=HTTP_200_OK)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from .models import AttendanceRecord, User, Subject, Student
from .serializers import (
    AttendanceReadSerializer, AttendanceWriteSerializer,
    UserSerializer, SubjectSerializer, StudentSerializer
)

@api_view(["GET"])
def faculty_all(request):
    qs = User.objects.filter(role="faculty")
    return Response(UserSerializer(qs, many=True).data, status=HTTP_200_OK)

@api_view(["GET"])
def subjects_all(request):
    qs = Subject.objects.all().order_by("name")
    return Response(SubjectSerializer(qs, many=True).data, status=HTTP_200_OK)

@api_view(["GET"])
def students_all(request):
    qs = Student.objects.all().order_by("name")
    return Response(StudentSerializer(qs, many=True).data, status=HTTP_200_OK)

@api_view(["GET", "POST"])
def add_attendance(request):
    if request.method == "POST":
        ser = AttendanceWriteSerializer(data=request.data)
        if ser.is_valid():
            att = ser.save()
            # return nested read version
            read = AttendanceReadSerializer(att)
            return Response(read.data, status=HTTP_201_CREATED)
        return Response(ser.errors, status=HTTP_400_BAD_REQUEST)

    # GET (list with optional filters)
    qs = Attendance.objects.select_related("faculty", "subject").prefetch_related("students").all()

    faculty = request.query_params.get("faculty")       # username
    subject = request.query_params.get("subject")       # id
    date = request.query_params.get("date")             # YYYY-MM-DD

    if faculty:
        qs = qs.filter(faculty__username=faculty)
    if subject:
        qs = qs.filter(subject__id=subject)
    if date:
        qs = qs.filter(date=date)

    ser = AttendanceReadSerializer(qs.order_by("-date", "-id"), many=True)
    return Response(ser.data, status=HTTP_200_OK)