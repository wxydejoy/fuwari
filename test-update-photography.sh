#!/bin/bash

echo "=== 测试摄影配置更新脚本 ==="
echo ""

# 模拟GitHub Action的环境变量
GITHUB_TOKEN="${GITHUB_TOKEN:-}"
if [ -z "$GITHUB_TOKEN" ]; then
    echo "警告: 未设置GITHUB_TOKEN环境变量，将只测试获取和解析逻辑"
    echo ""
fi

# 步骤1：获取当前photography.txt
echo "步骤1：获取当前photography.txt"
if [ -f "public/photography.txt" ]; then
    CURRENT=$(cat "public/photography.txt")
    CURRENT_LENGTH=$(echo "$CURRENT" | wc -l)
    echo "当前内容长度: $CURRENT_LENGTH 行"
    echo "当前内容:"
    echo "$CURRENT"
else
    echo "当前photography.txt不存在"
    CURRENT=""
fi
echo ""

# 步骤2：获取图床相册
echo "步骤2：获取图床相册"
echo "正在获取: https://imgchr.com/album/vkBKs"
RESPONSE=$(curl -s "https://imgchr.com/album/vkBKs")

if [ $? -eq 0 ]; then
    echo "获取成功"
    echo "响应长度: $(echo "$RESPONSE" | wc -c) 字符"
else
    echo "获取失败"
    exit 1
fi
echo ""

# 步骤3：提取图片链接
echo "步骤3：提取图片链接"
# 提取所有.jpg链接，然后移除.md部分
NEW_URLS=$(echo "$RESPONSE" | grep -oP 'https://[^"]*\.jpg[^"]*' | sed 's/\.md\.jpg/.jpg/g' | sort -u)
NEW_LENGTH=$(echo "$NEW_URLS" | wc -l)
echo "提取到 $NEW_LENGTH 个图片链接"
echo "提取的链接:"
echo "$NEW_URLS"
echo ""

# 步骤4：转换为每行格式
echo "步骤4：转换为每行格式"
NEW_CONTENT=$(echo "$NEW_URLS" | sed 's/ /\n/g')
echo "转换后内容:"
echo "$NEW_CONTENT"
echo ""

# 步骤5：比较内容
echo "步骤5：比较内容"
if [ "$CURRENT" = "$NEW_CONTENT" ]; then
    echo "✓ 内容完全相同，无需更新"
    CHANGED=false
elif [ -z "$CURRENT" ]; then
    echo "✓ 当前文件为空，需要创建新文件"
    CHANGED=true
else
    echo "✓ 内容有变化，需要更新"
    echo "当前长度: $CURRENT_LENGTH 行"
    echo "新长度: $NEW_LENGTH 行"
    CHANGED=true
fi
echo ""

# 步骤6：备份和更新（如果有变化）
if [ "$CHANGED" = true ]; then
    echo "步骤6：备份和更新文件"
    
    # 备份旧文件
    if [ -f "public/photography.txt" ]; then
        cp "public/photography.txt" "public/photography.txt.backup"
        echo "✓ 已备份到 public/photography.txt.backup"
    fi
    
    # 更新文件
    echo "$NEW_CONTENT" > "public/photography.txt"
    echo "✓ 已更新 public/photography.txt"
    
    # 显示更新后的内容
    echo ""
    echo "更新后的文件内容:"
    cat "public/photography.txt"
    
    # Git操作（如果有token）
    if [ -n "$GITHUB_TOKEN" ]; then
        echo ""
        echo "步骤7：Git操作"
        
        # 设置Git配置
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        
        # 提交更改
        git add "public/photography.txt"
        if [ -f "public/photography.txt.backup" ]; then
            git add "public/photography.txt.backup"
        fi
        
        git commit -m "Update photography.txt from imgchr album [TEST]"
        echo "✓ 已提交更改"
        
        # 推送更改
        echo "正在推送..."
        git push
        if [ $? -eq 0 ]; then
            echo "✓ 推送成功"
        else
            echo "✗ 推送失败"
        fi
    else
        echo ""
        echo "注意: 未设置GITHUB_TOKEN，跳过Git操作"
    fi
else
    echo ""
    echo "=== 测试完成 ==="
    echo "结果: 无需更新"
fi
