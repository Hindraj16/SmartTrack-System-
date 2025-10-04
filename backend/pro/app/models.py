from django.db import models
from re import S


# Create your models here.


class Subject(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Student(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"{self.name} ({self.email})"


class User(models.Model):
    username = models.CharField(primary_key=True,max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    ROLE_CHOICES = [
        ('faculty', 'Faculty'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(choices=ROLE_CHOICES, max_length=100)   # Faculty, Admin, etc.

    def __str__(self):
        return self.username


class AttendanceRecord(models.Model):
    faculty = models.ForeignKey('User', on_delete=models.CASCADE, related_name='attendance')
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE, related_name='attendance')
    students = models.ManyToManyField('Student', related_name='attendance')
    number_of_students = models.IntegerField(default=0)
    date = models.DateField()
    time = models.TimeField()

    def __str__(self):
        return f"{self.faculty.firstName} {self.faculty.lastName} - {self.subject.name} - {self.date}"

# Explicit join table (like @JoinTable in JPA)
class AttendanceStudents(models.Model):
    attendance_record = models.ForeignKey(AttendanceRecord, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)

    class Meta:
        db_table = "attendance_students"
        unique_together = ("attendance_record", "student")


