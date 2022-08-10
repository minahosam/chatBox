from django.shortcuts import render
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
import random
from .models import *
import time
import json
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def lobby(request):
    return render(request,'base/lobby.html')

def room(request):
    return render(request,'base/room.html')

def get_token(request):
    appId = '756b609c3c9d4c3089be50700284483c'
    appCertificate = '12f6a234649b44199f55688093ff3d0e'
    channelName = request.GET.get('channel')
    uid = random.randint(1,230)
    role = 1
    TIMEINSECOND = 3600 * 24
    currentTime = time.time()
    privilegeExpiredTs = currentTime + TIMEINSECOND
    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return JsonResponse({'UID':uid,'channelName':channelName,'token':token},safe=False)


@csrf_exempt
def create_member(request):
    data = json.loads(request.body)
    member , created = RoomMember.objects.get_or_create(
        member_name=data['name'],
        member_uid=data['uid'],
        room_name=data['room']
    )
    return JsonResponse({'member_name':data['name']},safe=False)

def get_member(request):
    uid = request.GET.get('uid')
    room = request.GET.get('room')
    member = RoomMember.objects.get(member_uid=uid, room_name=room)
    name = member.member_name
    return JsonResponse({'name':member.member_name},safe=False)

@csrf_exempt
def delete_member(request):
    data = json.loads(request.body)
    member = RoomMember.objects.get(member_uid=data['uid'],member_name=data['name'],room_name=data['room'])
    member.delete()
    return JsonResponse('deleted',safe=False)