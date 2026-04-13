#!/bin/bash
# hook修改为服务器部署的hook，端口对于vpn放开；ip为远端服务器地址
# 当前目录
# admin.p为密码存放文件，注意仅有密码，文件放入项目的上层目录下
CURRENT_DIR=$(pwd)
SCRIPT_NAME=$(basename "$0")
Projecthook(){
WebHook="http://121.40.183.14:8090/hook?access_key=9c2IICLp6vAixgDkoajnGPZnxgzkqQcMcZYvPGtDhqNcsBOe&async=0&param=$BASE64_PROJECT"
curl $WebHook
}

# 检查参数
if [ -z "$1" ]; then
    echo "错误：请指定目录名"
    echo "当前目录下的文件夹："
    ls -d */ 2>/dev/null | sed 's|/||g'
    exit 1
fi
# 检查是否与脚本名称重复
if [ "$1" = "$SCRIPT_NAME" ]; then
    echo "错误：目录名不能与脚本文件名相同"
    echo "脚本文件名：$SCRIPT_NAME"
    exit 1
fi
# 检查目录是否存在
if [ ! -d "$1" ]; then
    echo "错误：目录 '$1' 不存在"
    exit 1
fi

# 执行同步
echo "同步 $1/ 到远程..."
if [ -d "$1/dist" ]; then
    rsync -av --password-file=./chanpin6 "$1/dist/" "rsync://chanpin6@121.40.183.14:8730/project/$1/"
else
    rsync -av --password-file=./chanpin6 --exclude='node_modules' --exclude='*.py' --exclude='*.js' --exclude='package*.json' --exclude='.DS_Store' "$1/" "rsync://chanpin6@121.40.183.14:8730/project/$1/"
fi
BASE64_PROJECT=`echo $1|base64`
Projecthook
echo "https://pm.pro.jishu666.com/$1/index.html"